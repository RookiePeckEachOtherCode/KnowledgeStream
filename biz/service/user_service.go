package service

import (
	"context"
	"errors"
	"fmt"
	"sync"

	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/srverror"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/utils"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/config"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"gorm.io/gorm"
)

var (
	userServiceOnce sync.Once
	userService     *UserService
)

func UserServ() *UserService {
	userServiceOnce.Do(func() {
		/**
		* 依赖注入位置
		* eg.
		* userService = &UserService{
		  userRepo: UserRepo,
		  otherService: OtherService,
		}
		**/
		userService = &UserService{}
	})
	return userService
}

type UserService struct {
}

func (s *UserService) UserRegister(
	c context.Context,
	name string,
	phone string,
	password string,
) error {
	u := query.User
	dbUser, err := u.WithContext(c).Select(u.ID).Where(u.Phone.Eq(phone)).First()
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	if dbUser != nil {
		return srverror.NewRuntimeError("手机号已存在")
	}
	id, err := utils.NextSnowFlakeId()
	if err != nil {
		return err
	}
	salt, err := utils.GenerateSalt(16)
	if err != nil {
		return err
	}
	hashedPassword := utils.HashPassword(password, salt)

	user := entity.User{
		ID:        *id,
		Avatar:    config.Get().DefaultAvatarURL,
		Salt:      salt,
		Password:  hashedPassword,
		Name:      name,
		Phone:     phone,
		Authority: entity.AuthorityUser,
	}

	if err = u.WithContext(c).Save(&user); err != nil {
		return err
	}
	return nil
}

func (s *UserService) UserLoginWithPhone(c context.Context, phone string, password string) (int64, string, string, error) {
	u := query.User

	user, err := u.WithContext(c).Where(u.Phone.Eq(phone)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, "", "", srverror.NewRuntimeError("用户不存在")
		}
		hlog.Error(err)
		return 0, "", "", err
	}
	isValid := utils.VerifyPassword([]byte(user.Password), []byte(user.Salt), password)
	if !isValid {
		return 0, "", "", srverror.NewRuntimeError("密码错误")
	}
	token := utils.GenerateToken(user.ID, user.Authority)
	return user.ID, user.Name, token, nil
}

func (s *UserService) GetUserInfoWithId(c context.Context, id int64) (*entity.User, error) {
	u := query.User
	user, err := u.WithContext(c).Where(u.ID.Eq(id)).First()
	if err != nil {
		return nil, err
	}
	return user, err
}

func (s *UserService) UpdateUserInfoWithId(c context.Context, id int64, name string, password string, avatar string, phone string) error {
	u := query.User
	user, err := u.WithContext(c).Where(u.ID.Eq(id)).First()
	if err != nil {
		return err
	}
	if name != "" {
		user.Name = name
	}
	if password != "" {
		hashedPassword := utils.HashPassword(password, user.Salt)
		user.Password = hashedPassword
	}
	if avatar != "" {
		user.Avatar = avatar
	}
	if phone != "" {
		user.Phone = phone
	}
	if err := u.WithContext(c).Save(user); err != nil {
		return fmt.Errorf("save error falied: %w", err)
	}
	return nil
}

// ------------------------------------------Techer
func (s *UserService) CreateCourseWithId(c context.Context, id int64, title string, description string, cover string) error {
	cid, err := utils.NextSnowFlakeId()
	if err != nil {
		return err
	}
	cc := query.Course
	course := entity.Course{
		ID:          *cid,
		Title:       title,
		Description: description,
		Cover:       cover,
		Ascription:  id,
	}
	if err := cc.WithContext(c).Save(&course); err != nil {
		return fmt.Errorf("save error falied: %w", err)
	}
	return nil
}
func (s *UserService) DeleteCourseWithCid(c context.Context, cid int64) error {
	cc := query.Course
	course, err := cc.WithContext(c).Where(cc.ID.Eq(cid)).First()
	if err != nil {
		return err
	}
	if _, err = cc.WithContext(c).Delete(course); err != nil {
		return fmt.Errorf("delete error falied: %w", err)
	}
	return nil
}
func (s *UserService) UpdateCourseWithCid(c context.Context, cid int64, title string, description string, cover string) error {
	cc := query.Course
	course, err := cc.WithContext(c).Where(cc.ID.Eq(cid)).First()
	if err != nil {
		return err
	}
	if title != "" {
		course.Title = title
	}
	if description != "" {
		course.Description = description
	}
	if cover != "" {
		course.Cover = cover
	}
	if err = cc.WithContext(c).Save(course); err != nil {
		return fmt.Errorf("save error falied: %w", err)
	}
	return nil
}
func (s *UserService) InviteStudentWithCidAndSid(c context.Context, cid int64, sid int64) error {
	uc := query.UserInCourse
	uinc, err := uc.WithContext(c).Where(uc.UserID.Eq(sid), uc.CourseID.Eq(cid)).First()
	if err == nil {
		if uinc != nil {
			return errors.New("该学生已在课程中")
		}
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return fmt.Errorf("查询关联记录失败: %w", err)
	}
	ucc := entity.UserInCourse{
		UserID:   sid,
		CourseID: cid,
	}
	if err = uc.WithContext(c).Save(&ucc); err != nil {
		return fmt.Errorf("save error falied: %w", err)
	}
	return nil
}
func (s *UserService) UploadVideoWithCidAndUid(c context.Context, uid int64, cid int64, source string, title string, description string, cover string, length int) error {

	return nil
}
func (s *UserService) OperateMemberWithCidAndUid(c context.Context, cid int64, uid int64) error {
	return nil
}
