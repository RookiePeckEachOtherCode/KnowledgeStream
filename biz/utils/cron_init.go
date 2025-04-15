package utils

import (
	"context"
	"fmt"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/redis"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"github.com/robfig/cron/v3"
)

func CronInit() {
	c := cron.New()
	ctx := context.Background()
	_, err := c.AddFunc("@every 5s", func() {
		v := query.Video
		videos, err := v.WithContext(ctx).Find()
		if err != nil {
			hlog.Error("查询视频数据爆了: ", err)
			return
		}
		for _, video := range videos {
			recordKey := redis.GenVideoPlaysRecordKey(video.ID)
			exists, err := redis.Client.R.Exists(ctx, recordKey).Result()
			if err != nil {
				hlog.Error("VideoPlaysRecord redis的记录查询存在爆了: ", err)
				return
			}
			if exists == 0 {
				fmt.Println("不存在")
			}
			if exists > 0 {
				record := redis.VideoPlaysRecord{}
				err = redis.Client.GetValue(ctx, recordKey, record)
				if err != nil {
					hlog.Error("VideoPlaysRecord redis的记录查询存在爆了: ", err)
					return
				}
				video.Plays = record.Plays
				_, err = v.WithContext(ctx).Where(v.ID.Eq(video.ID)).Updates(video)
				if err != nil {
					hlog.Error("更新视频信息失败: ", err)
					return
				}
			}
		}
	})
	if err != nil {
		panic(err)
	}
	c.Start()
}
