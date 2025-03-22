package pg

import (
	"os"
	"path/filepath"

	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/config"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"gorm.io/driver/postgres"
	"gorm.io/gen"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	outDir := "biz/dal/pg/query"
	if err := os.MkdirAll(outDir, os.ModePerm); err != nil {
		hlog.Fatal("无法创建目录:", err)
	}

	generator := gen.NewGenerator(gen.Config{
		OutFile:      filepath.Join(outDir, "query.gen.go"), // 主查询文件
		OutPath:      outDir,
		ModelPkgPath: filepath.Join(outDir), // 模型文件目录
		Mode:         gen.WithoutContext | gen.WithDefaultQuery | gen.WithQueryInterface,
	})

	db, err := gorm.Open(postgres.Open(config.Get().DBConnectURL()), &gorm.Config{})
	if err != nil {
		hlog.Fatal("failed to connect database:", err)
	}

	generator.UseDB(db)

	generator.ApplyBasic(
		entity.User{},
		entity.UserInCourse{},
		entity.Course{},
		entity.Video{},
		entity.Notification{},
		entity.Comment{},
	)

	generator.Execute()

	query.SetDefault(db)

	if query.User == nil {
		hlog.Fatal("query.User is nil")
	}

	DB = db
}
