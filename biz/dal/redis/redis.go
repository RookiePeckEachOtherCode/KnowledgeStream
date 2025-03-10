package redis

import (
	"context"
	"encoding/json"

	"github.com/RookiePeckEachOtherCode/KnowledgeStream/config"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"github.com/go-redis/redis/v8"
)

type RedisClient struct {
	R *redis.Client
}

var Client *RedisClient

func InitRedis() {
	rdb := redis.NewClient(config.Get().RedisOption())
	Client = &RedisClient{
		R: rdb,
	}
}
func (r RedisClient) SetValue(ctx context.Context, key string, data any) {
	marshal, err := json.Marshal(data)
	if err != nil {
		hlog.Error("failed in Json Object", err)
	}
	err = r.R.Set(ctx, key, marshal, 0).Err()
	if err != nil {
		hlog.Error("failed keep in redis", err)
	}

}
func (r RedisClient) GetValue(ctx context.Context, key string, out interface{}) error {
	val, err := r.R.Get(ctx, key).Result()
	if err != nil {
		return err
	}
	err = json.Unmarshal([]byte(val), &out)
	if err != nil {
		return err
	}

	return nil

	//用法:
	//var xlsx type
	//err := RedisUtils.GetValue(c, key, &xlsx)
}
