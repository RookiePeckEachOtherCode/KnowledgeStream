package entity

type Video struct {
	ID          int64  `gorm:"primaryKey;column:id" json:"id"`
	Source      string `gorm:"column:source" json:"source"`
	Title       string `gorm:"column:title" json:"title"`
	Description string `gorm:"column:description" json:"description"`
	Uploader    int64  `gorm:"column:uploader" json:"uploader"` // 上传者用户ID
	Length      string `gorm:"column:length" json:"length"`     // 视频长度（单位秒）
	Cover       string `gorm:"column:cover" json:"cover"`
	Ascription  int64  `gorm:"column:ascription" json:"ascription"` // 所属课程ID（外键）
	UploadTime  string `gorm:"column:upload_time" json:"upload_time"`
	Chapter     string `gorm:"column:chapter" json:"chapter"`
	Plays       int32  `gorm:"column:plays" json:"plays"`
	Major       string `gorm:"column:major" json:"major"`
}
