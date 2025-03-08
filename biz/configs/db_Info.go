package configs

import (
	"fmt"
	"github.com/go-redis/redis/v8"
)

const (
	DbUser   = "root"
	DbPasswd = "rookie"
	DbUrl    = "localhost"
	PORT     = "5432"
	DbName   = "KS"
)

func GetDBInfo() string {
	return fmt.Sprintf("host=%s user=%s dbname=%s password=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		DbUrl, DbUser, DbName, DbPasswd, PORT)
}

const (
	RedisAddr = "localhost:6379"
	RedisDB   = 0
)

func RedisConfig() *redis.Options {
	return &redis.Options{
		Addr: RedisAddr,
		DB:   RedisDB,
	}
}
