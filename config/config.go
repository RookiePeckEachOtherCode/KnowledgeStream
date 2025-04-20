package config

import (
	"fmt"
	"os"
	"sync"

	"github.com/cloudwego/hertz/pkg/common/hlog"
	"github.com/go-redis/redis/v8"
	"github.com/spf13/viper"
)

var once sync.Once

type Config struct {
	JWT struct {
		Key        string `mapstructure:"key"`
		Expiration int    `mapstructure:"expiration"`
	} `mapstructure:"jwt"`

	DefaultAvatarURL string `mapstructure:"default_avatar_url"`

	SnowflakeNode int64 `mapstructure:"snowflake_node"`

	Database struct {
		Host     string `mapstructure:"host"`
		Port     int    `mapstructure:"port"`
		Username string `mapstructure:"username"`
		Password string `mapstructure:"password"`
		DBName   string `mapstructure:"db_name"`
	} `mapstructure:"database"`

	Redis struct {
		Host     string `mapstructure:"host"`
		Port     int    `mapstructure:"port"`
		Database int    `mapstructure:"database"`
	} `mapstructure:"redis"`

	OssBuckets struct {
		VideoSource        string `mapstructure:"bucket_video"`
		CourseCover        string `mapstructure:"bucket_course_cover"`
		UserAvatar         string `mapstructure:"bucket_user_avatar"`
		NotificationAnnex  string `mapstructure:"bucket_notification_annex"`
		DefaultCourseCover string `mapstructure:"course_cover"`
		DefaultUserAvatar  string `mapstructure:"user_avatar"`
	} `mapstructure:"oss_buckets"` // ← 这里必须与 YAML 的键名一致

}

var configData *Config

func (c *Config) RedisOption() *redis.Options {
	return &redis.Options{
		Addr: fmt.Sprintf("%s:%d", c.Redis.Host, c.Redis.Port),
		DB:   c.Redis.Database,
	}
}
func (c *Config) DBConnectURL() string {
	return fmt.Sprintf(
		"host=%s user=%s dbname=%s password=%s port=%d sslmode=disable TimeZone=Asia/Shanghai",
		c.Database.Host, c.Database.Username, c.Database.DBName, c.Database.Password, c.Database.Port)
}

func Get() *Config {
	once.Do(func() {
		configData = loadConfig()
	})
	return configData
}

func loadConfig() *Config {
	productEnv := os.Getenv("online")

	if productEnv == "online" {
		viper.SetConfigFile("config/online/config.yaml")
	} else {
		viper.SetConfigFile("config/dev/config.yaml")
	}

	err := viper.ReadInConfig()
	if err != nil {
		hlog.Error("读取配置文件失败")
		panic(err)
	}

	cfg := &Config{}

	err = viper.Unmarshal(cfg)
	if err != nil {
		hlog.Error("解析配置文件失败")
		panic(err)
	}

	return cfg
}
