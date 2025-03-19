package entity

type AuthorityEnum string

const (
	AuthorityUser       AuthorityEnum = "USER"
	AuthorityAdmin      AuthorityEnum = "ADMIN"
	AuthoritySuperAdmin AuthorityEnum = "SUPER_ADMIN"
)

type User struct {
	ID        int64         `gorm:"primaryKey;column:id" json:"id"`
	Avatar    string        `gorm:"column:avatar" json:"avatar"`
	Salt      []byte        `gorm:"column:salt" json:"-"`
	Password  []byte        `gorm:"column:password" json:"-"`
	Name      string        `gorm:"column:name" json:"name"`
	Phone     string        `gorm:"column:phone" json:"phone"`
	Authority AuthorityEnum `gorm:"column:authority;default:USER" json:"authority"` // 使用枚举类型
	Grade     string        `gorm:"column:grade" json:"grade"`
}
