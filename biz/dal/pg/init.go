package pg

import (
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/config"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	db, err := gorm.Open(postgres.Open(config.Get().DBConnectURL()), &gorm.Config{})
	if err != nil {
		hlog.Fatal("failed to connect database:", err)
	}

	// generateGorm(db)

	query.SetDefault(db)

	if query.User == nil {
		hlog.Fatal("query.User is nil")
	}

	DB = db
}

// func generateGorm(db *gorm.DB) {
// 	outDir := "biz/dal/pg/query"
// 	if err := os.MkdirAll(outDir, os.ModePerm); err != nil {
// 		hlog.Fatal("无法创建目录:", err)
// 	}

// 	generator := gen.NewGenerator(gen.Config{
// 		OutFile:      filepath.Join(outDir, "query.gen.go"), // 主查询文件
// 		OutPath:      outDir,
// 		ModelPkgPath: filepath.Join(outDir), // 模型文件目录
// 		Mode:         gen.WithoutContext | gen.WithDefaultQuery | gen.WithQueryInterface,
// 	})

// 	generator.UseDB(db)

// 	generator.ApplyBasic(
// 		entity.User{},
// 		entity.UserInCourse{},
// 		entity.Course{},
// 		entity.Video{},
// 		entity.Notification{},
// 		entity.Comment{},
// 		entity.Class{},
// 	)

// 	generator.Execute()
// }
