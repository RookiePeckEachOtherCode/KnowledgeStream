package entity

type Class struct {
	ClassName string `gorm:"primaryKey;column:class_name" json:"class_name"`
}
