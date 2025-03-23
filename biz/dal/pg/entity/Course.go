package entity

type Course struct {
	ID          int64  `gorm:"primaryKey;column:id" json:"id"`
	Title       string `gorm:"column:title" json:"title"`
	Description string `gorm:"column:description" json:"description"`
	Cover       string `gorm:"column:cover" json:"cover"`
	Ascription  int64  `gorm:"column:ascription" json:"ascription"` // 所属用户ID
	BeginTime   string `gorm:"column:begin_time" json:"begin_time"`
	EndTime     string `gorm:"column:end_time" json:"end_time"`
	Major       string `gorm:"column:major" json:"major"`
	Class       string `gorm:"column:class" json:"class"`
}
