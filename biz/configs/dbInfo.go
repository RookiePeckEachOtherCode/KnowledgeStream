package configs

import "fmt"

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
