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
	identity string,
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
<<<<<<< Updated upstream
	_, err = u.WithContext(c).Where(u.Name.Eq(name)).First()
	if err == nil {
		return errors.New("name existed")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
=======
	if identity == "teacher" {
		user.Authority = entity.AuthorityAdmin
	}
	if err = u.WithContext(c).Save(&user); err != nil {
>>>>>>> Stashed changes
		return err
	}

	if err = u.WithContext(c).Save(&user); err != nil {
		return fmt.Errorf("save error falied: %w", err)
	}

	return nil
}

func (s *UserService) UserLoginWithName(c context.Context, name string, password string) (*int64, *string, error) {
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

func (s *UserService) UserLoginWithPhone(c context.Context, phone string, password string) (*int64, *string, error) {
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
<<<<<<< Updated upstream

// ------------------------------------------Techer
func (s *UserService) CreateCourseWithUid(c context.Context, uid int64, title string, description string, cover string) error {
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
		Ascription:  uid,
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
func (s *UserService) UploadVideoWithCidAndUid(c context.Context, uid int64, cid int64, source string, title string, description string, cover string) error {
	v := query.Video
	id, err := utils.NextSnowFlakeId()
	if err != nil {
		return err
	}
	video := entity.Video{
		ID:          *id,
		Uploader:    uid,
		Source:      source,
		Title:       title,
		Description: description,
		Cover:       cover,
		Ascription:  cid,
	}

	err = v.WithContext(c).Save(&video)
	if err != nil {
		return fmt.Errorf("save error falied: %w", err)
	}
	return nil
}
func (s *UserService) OperateMemberWithCidAndUid(c context.Context, cid int64, uid int64) error {
	uc := query.UserInCourse
	uinc, err := uc.WithContext(c).Where(uc.UserID.Eq(uid), uc.CourseID.Eq(cid)).First()
	if err != nil {
		return fmt.Errorf("该学生并不在该课程域中: %w", err)
	}
	if _, err = uc.WithContext(c).Delete(uinc); err != nil {
		return fmt.Errorf("delete error falied: %w", err)
	}
	return nil
}
func (s *UserService) SelectMyCoursesWithUid(c context.Context, uid int64) ([]string, error) {
	cc := query.Course
	var result []string
	var courses []*entity.Course
	var err error
	if courses, err = cc.WithContext(c).
		Where(cc.Ascription.Eq(uid)).
		Find(); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("查询课程失败: %w", err)
	}
	for _, course := range courses {
		idStr := fmt.Sprintf("%d", course.ID)
		result = append(result, idStr)
	}
	return result, nil
=======
func (s *UserService) UpdateUserIdentityWithUid(c context.Context, uid int64, authority string) error {
	u := query.User
	user, err := u.WithContext(c).Where(u.ID.Eq(uid)).First()
	if err != nil {
		return err
	}
	if authority == "" {
		return nil
	}
	if authority == "USER" {
		user.Authority = entity.AuthorityUser
	} else if authority == "ADMIN" {
		user.Authority = entity.AuthorityAdmin
	} else {
		user.Authority = entity.AuthoritySuperAdmin
	}
	if err := u.WithContext(c).Save(user); err != nil {
		return fmt.Errorf("更新用户权限失败: %w", err)
	}
	return nil
}
func (s *UserService) DeleteUserWithUid(c context.Context, uid int64) error {
	u := query.User
	user, err := u.WithContext(c).Where(u.ID.Eq(uid)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("用户不存在或已被删除")
		}
		return fmt.Errorf("查询用户失败: %w", err)
	}
	_, err = u.WithContext(c).Delete(user)
	if err != nil {
		return fmt.Errorf("用户删除失败: %w", err)
	}
	return nil
>>>>>>> Stashed changes
}
