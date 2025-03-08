package entity

type UserInCourse struct {
	UserID   int64 `gorm:"primaryKey;column:uid" json:"uid"`
	CourseID int64 `gorm:"primaryKey;column:cid" json:"cid"`
}

func (UserInCourse) TableName() string {

	return "user_course"

}
