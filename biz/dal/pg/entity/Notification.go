package entity

type Notification struct {
	ID       int64  `gorm:"primaryKey;column:id" json:"id"`
	Cid      int64  `gorm:"column:cid" json:"cid"`
	Content  string `gorm:"column:content" json:"content"`
	File     string `gorm:"column:file" json:"file"`
	Favorite int32  `gorm:"column:favorite" json:"favorite"`
	Title    string `gorm:"column:title" json:"title"`
	Time     string `gorm:"column:time" json:"time"`
}
