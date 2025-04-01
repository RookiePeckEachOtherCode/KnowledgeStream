package entity

type Comment struct {
	ID         int64  `gorm:"primaryKey;column:id" json:"id"`
	Ascription int64  `gorm:"column:ascription" json:"ascription"`
	Avatar     string `gorm:"column:avatar" json:"avatar"`
	Name       string `gorm:"column:name" json:"name"`
	Content    string `gorm:"column:content" json:"content"`
	Parent     int64  `gorm:"column:parent" json:"parent"`
	Time       string `gorm:"column:time" json:"time"`
	Children   int64  `gorm:"column:children" json:"children"`
}
