package service

import (
	"context"
	"errors"
	"fmt"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
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
		hlog.Error("注册用户失败: ", err)
		return err
	}
	return nil
}

func (s *UserService) UserLoginWithPhone(c context.Context, phone string, password string) (int64, string, string, string, error) {
	u := query.User

	user, err := u.WithContext(c).Where(u.Phone.Eq(phone)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, "", "", "", srverror.NewRuntimeError("用户不存在")
		}
		hlog.Error("用户登录失败: ", err)
		return 0, "", "", "", err
	}
	isValid := utils.VerifyPassword([]byte(user.Password), []byte(user.Salt), password)
	if !isValid {
		return 0, "", "", "", srverror.NewRuntimeError("密码错误")
	}
	token := utils.GenerateToken(user.ID, user.Authority)
	var authority string
	if user.Authority == entity.AuthorityUser {
		authority = "Student"
	} else if user.Authority == entity.AuthorityAdmin {
		authority = "Teacher"
	} else {
		authority = "Admin"
	}
	return user.ID, user.Name, token, authority, nil
}

func (s *UserService) GetUserInfoWithId(c context.Context, id int64) (*entity.User, error) {
	u := query.User
	user, err := u.WithContext(c).Where(u.ID.Eq(id)).First()
	if err != nil {
		hlog.Error("获取用户信息失败: ", err)
		return nil, err
	}
	return user, err
}

func (s *UserService) UpdateUserInfoWithId(c context.Context, id int64, name string, avatar string, phone string, signature string, major string, faculty string, grade string, class string) error {
	u := query.User
	user, err := u.WithContext(c).Where(u.ID.Eq(id)).First()
	if err != nil {
		return err
	}
	if major == "" {
		major = user.Major
	}
	if faculty == "" {
		faculty = user.Faculty
	}
	if grade == "" {
		grade = user.Grade
	}
	if class == "" {
		class = user.Class
	}
	_, err = u.WithContext(c).Where(u.ID.Eq(id)).Updates(entity.User{
		Name:      name,
		Avatar:    avatar,
		Phone:     phone,
		Signature: signature,
		Major:     major,
		Faculty:   faculty,
		Grade:     grade,
		Class:     class,
	})
	if err != nil {
		hlog.Error("更新用户信息失败: ", err)
		return err
	}
	return nil
}
func (s *UserService) UpdateUserIdentityWithUid(c context.Context, uid int64, authority string) error {
	u := query.User
	user, err := u.WithContext(c).Where(u.ID.Eq(uid)).First()
	if err != nil {
		return err
	}
	if authority == "" {
		return nil
	}
	if authority == "Student" {
		user.Authority = entity.AuthorityUser
	} else if authority == "Teacher" {
		user.Authority = entity.AuthorityAdmin
	} else if authority == "Admin" {
		user.Authority = entity.AuthoritySuperAdmin
	}
	if err := u.WithContext(c).Save(user); err != nil {
		hlog.Error("更新用户权限失败: ", err)
		return err
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
		hlog.Error("查询用户失败: ", err)
		return err
	}
	uc := query.UserInCourse
	_, err = uc.WithContext(c).Where(uc.UserID.Eq(uid)).Delete()
	if err != nil {
		hlog.Error("删除用户关联课程失败: ", err)
		return err
	}
	_, err = u.WithContext(c).Delete(user)
	if err != nil {
		hlog.Error("删除用户失败: ", err)
		return err
	}
	return nil
}
func (s *UserService) AdminQueryUser(
	c context.Context,
	keyword string,
	size int32,
	offset int32,
	major string,
	faculty string,
	authority string,
) ([]*base.UserInfo, error) {
	// 转换权限标识到存储值
	switch authority {
	case "Student":
		authority = "USER"
	case "Teacher":
		authority = "ADMIN"
	case "Admin":
		authority = "SUPER_ADMIN"
	default:
		authority = "" // 无效值视为不过滤权限
	}

	u := query.User
	queryBuilder := u.WithContext(c).
		Where(u.Authority.Neq("SUPER_ADMIN")) // 始终排除超级管理员

	// 动态构建查询条件
	if keyword != "" {
		queryBuilder = queryBuilder.Where(u.Name.Like("%" + keyword + "%"))
	}
	if major != "" {
		queryBuilder = queryBuilder.Where(u.Major.Like("%" + major + "%"))
	}
	if faculty != "" {
		queryBuilder = queryBuilder.Where(u.Faculty.Like("%" + faculty + "%"))
	}
	if authority != "" {
		queryBuilder = queryBuilder.Where(u.Authority.Eq(authority))
	}

	// 执行分页查询
	users, err := queryBuilder.
		Offset(int(offset)).
		Limit(int(size)).
		Find()
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		hlog.Error("查询用户失败: ", err)
		return nil, err
	}

	// 转换结果集
	var result []*base.UserInfo
	for _, user := range users {
		userInfo := &base.UserInfo{
			Name:      user.Name,
			Avatar:    user.Avatar,
			Phone:     user.Phone,
			UID:       fmt.Sprintf("%d", user.ID),
			Signature: user.Signature,
			Faculty:   user.Faculty,
			Class:     user.Class,
			Major:     user.Major,
			Grade:     user.Grade,
		}

		// 转换权限为业务术语
		switch user.Authority {
		case "USER":
			userInfo.Authority = "Student"
		case "ADMIN":
			userInfo.Authority = "Teacher"
		}
		result = append(result, userInfo)
	}
	return result, nil
}
func (s *UserService) TeacherQueryStudent(
	c context.Context,
	keyword string,
	size int32,
	offset int32,
) ([]*base.UserInfo, error) {
	u := query.User
	users, err := u.WithContext(c).
		Where(u.Name.Like("%" + keyword + "%")).
		Where(u.Authority.Eq("USER")).
		Offset(int(offset)).
		Limit(int(size)).Find()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		hlog.Error("查询学生失败: ", err)
		return nil, err
	}
	var result []*base.UserInfo
	for _, user := range users {
		userInfo := new(base.UserInfo)
		userInfo.Name = user.Name
		userInfo.Avatar = user.Avatar
		userInfo.UID = fmt.Sprintf("%d", user.ID)
		if user.Authority == entity.AuthorityUser {
			userInfo.Authority = "Student"
		} else if user.Authority == entity.AuthorityAdmin {
			userInfo.Authority = "Teacher"
		}
		userInfo.Class = user.Class
		userInfo.Grade = user.Grade
		userInfo.Signature = user.Signature
		userInfo.Faculty = user.Faculty
		userInfo.Major = user.Major
		result = append(result, userInfo)
	}
	return result, nil
}
func (s *UserService) StudentsStatistics(c context.Context, offset int32, size int32) ([]*base.StudentsStatistics, error) {
	u := query.User
	users, err := u.WithContext(c).
		Where(u.Authority.Eq("USER")).
		Order(u.Faculty).    // 根据 Faculty 排序，默认为升序，如果需要降序，使用 Order(u.Faculty.Desc())
		Offset(int(offset)). // 设置分页偏移量
		Limit(int(size)).    // 设置每页的大小
		Find()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		hlog.Error("查询学生失败: ", err)
		return nil, err
	}
	mp := make(map[string]int64)
	for _, user := range users {
		mp[user.Faculty]++
	}
	var result []*base.StudentsStatistics
	for faculty, count := range mp {
		ss := new(base.StudentsStatistics)
		ss.Faculty = faculty
		ss.Students = count
		result = append(result, ss)
	}
	return result, nil
}
func (s *UserService) TeachersStatistics(c context.Context, offset int32, size int32) ([]*base.TeachersStatistics, error) {
	u := query.User
	users, err := u.WithContext(c).
		Where(u.Authority.Eq("ADMIN")).
		Order(u.Faculty).
		Offset(int(offset)).
		Limit(int(size)).Find()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		hlog.Error("查询教师失败: ", err)
		return nil, err
	}
	mp := make(map[string]int64)
	for _, user := range users {
		mp[user.Faculty]++
	}
	var result []*base.TeachersStatistics
	for faculty, count := range mp {
		ss := new(base.TeachersStatistics)
		ss.Faculty = faculty
		ss.Teachers = count
		result = append(result, ss)
	}
	return result, nil
}
