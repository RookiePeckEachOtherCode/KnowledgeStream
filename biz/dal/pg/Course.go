package pg

type Course struct {
	ID          int64  `gorm:"primaryKey;column:id" json:"id"`
	Title       string `gorm:"column:title" json:"title"`
	Description string `gorm:"column:description" json:"description"`
	Cover       string `gorm:"column:cover" json:"cover"`
	Ascription  int64  `gorm:"column:ascription" json:"ascription"` // 所属用户ID
}
