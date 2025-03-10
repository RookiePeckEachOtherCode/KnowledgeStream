package service

import (
	"context"
	"errors"
	"fmt"
	"sync"

	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/utils"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/config"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"gorm.io/gorm"
)

var (
	userServiceOnce sync.Once
	userService     *_UserService
)

func UserService() *_UserService {
	userServiceOnce.Do(func() {
		/**
		* 依赖注入位置
		* eg.
		* userService = &_UserService{
			userRepo: userRepo,
			otherService: otherService,
		}
		**/
		userService = &_UserService{}
	})
	return userService
}

type _UserService struct {
}

func (s *_UserService) UserRegister(
	c context.Context,
	name string,
	phone string,
	password string,
) error {
	id, err := utils.NextSnowFlakeId()
	if err != nil {
		return err
	}
	salt, err := utils.GenerateSalt(16)
	if err != nil {
		return err
	}
	hashedPassword := utils.HashPassword(password, salt)

	u := query.User
	user := entity.User{
		ID:        *id,
		Avatar:    config.Get().DefaultAvatarURL,
		Salt:      salt,
		Password:  hashedPassword,
		Name:      name,
		Phone:     phone,
		Authority: entity.AuthorityUser,
	}
	_, err = u.WithContext(c).Where(u.Name.Eq(name)).First()
	if err == nil {
		return errors.New("name existed")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	if err = u.WithContext(c).Save(&user); err != nil {
		return fmt.Errorf("save error falied: %w", err)
	}

	return nil
}

func (s *_UserService) UserLoginWithName(c context.Context, name string, password string) (*int64, *string, error) {

	u := query.User
	user, err := u.WithContext(c).Where(u.Name.Eq(name)).First()
	if err != nil {
		return nil, nil, err
	}
	if user == nil {
		return nil, nil, errors.New("can't find user")
	}
	isValid := utils.VerifyPassword([]byte(user.Password), []byte(user.Salt), password)
	if !isValid {
		return nil, nil, errors.New("wrong password")
	}
	token := utils.GenerateToken(user.ID, user.Authority)
	return &user.ID, &token, nil

}

func (s *_UserService) UserLoginWithPhone(c context.Context, phone string, password string) (*int64, *string, error) {

	u := query.User
	user, err := u.WithContext(c).Where(u.Phone.Eq(phone)).First()
	if err != nil {
		return nil, nil, err
	}
	if user == nil {
		return nil, nil, errors.New("no phone record")
	}
	isValid := utils.VerifyPassword([]byte(user.Password), []byte(user.Salt), password)
	if !isValid {
		return nil, nil, errors.New("wrong password")
	}
	token := utils.GenerateToken(user.ID, user.Authority)
	return &user.ID, &token, nil

}

func (s *_UserService) GetUserInfoWithId(c context.Context, id int64) (*entity.User, error) {
	u := query.User
	user, err := u.WithContext(c).Where(u.ID.Eq(id)).First()
	if err != nil {
		return nil, err
	}
	return user, err
}

func (s *_UserService) UpdateUserInfoWithId(c context.Context, id int64, name string, password string, avatar string, phone string) error {
	u := query.User
	user, err := u.WithContext(c).Where(u.ID.Eq(id)).First()
	if err != nil {
		return err
	}
	salt, err := utils.GenerateSalt(16)
	if err != nil {
		return err
	}
	hashedPassword := utils.HashPassword(password, salt)
	user.Name = name
	user.Password = hashedPassword
	user.Avatar = avatar
	user.Phone = phone
	if err := u.WithContext(c).Save(user); err != nil {
		hlog.Errorf("save error falied: %w", err)
	}
	return nil
}
