package initialize

import (
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/configs"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"gorm.io/driver/postgres"
	"gorm.io/gen"
	"gorm.io/gorm"
	"log"
	"os"
	"path/filepath"
)

func InitDB() *gorm.DB {
	outDir := "./biz/dal/pg/query"
	if err := os.MkdirAll(outDir, os.ModePerm); err != nil {
		log.Fatal("无法创建目录:", err)
	}

	generator := gen.NewGenerator(gen.Config{
		OutFile:      filepath.Join(outDir, "query.gen.go"), // 主查询文件
		OutPath:      outDir,
		ModelPkgPath: filepath.Join(outDir), // 模型文件目录
		Mode:         gen.WithoutContext | gen.WithDefaultQuery | gen.WithQueryInterface,
	})

	db, err := gorm.Open(postgres.Open(configs.GetDBInfo()), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	generator.UseDB(db)

	generator.ApplyBasic(
		entity.User{},
		entity.UserInCourse{},
		entity.Course{},
		entity.Video{},
	)

	generator.Execute()

	query.SetDefault(db)

	if query.User == nil {
		log.Fatal("query.User is nil")
	}

	return db
}
