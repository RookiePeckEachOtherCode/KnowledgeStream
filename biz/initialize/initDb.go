package initialize

import (
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/configs"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg"
	"gorm.io/driver/postgres"
	"gorm.io/gen"
	"gorm.io/gorm"
	"log"
)

func InitDB() *gorm.DB {
	generator := gen.NewGenerator(gen.Config{
		OutFile: "../dal/pg/query",
		Mode:    gen.WithoutContext | gen.WithDefaultQuery | gen.WithQueryInterface, // generate mode
	})

	db, err := gorm.Open(postgres.Open(configs.GetDBInfo()), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	generator.UseDB(db)

	generator.ApplyBasic(pg.User{}, pg.UserInCourse{}, pg.Course{}, pg.Video{})
	generator.Execute()

	//query.SetDefault(db)
	//
	//if query.User == nil {
	//	log.Fatal("query.User is nil")
	//}
	
	return db
}
