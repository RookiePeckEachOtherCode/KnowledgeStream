package service

import (
	"context"
	"errors"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/redis"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/notification"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/utils"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"gorm.io/gorm"
	"strconv"
	"sync"
)

var (
	notificationServiceOnce sync.Once
	notificationService     *NotificationService
)

func NotificationServ() *NotificationService {
	notificationServiceOnce.Do(func() {
		notificationService = &NotificationService{}
	})
	return notificationService
}

type NotificationService struct {
}

func (s *NotificationService) CreateNotification(
	c context.Context,
	cid int64,
	content string,
	file string,
) (*base.BaseResponse, error) {

	//生成id并保存db
	flakeId, err := utils.NextSnowFlakeId()
	if err != nil {
		hlog.Error("雪花id怎么生成报错了啊: ", err)
		return nil, err
	}
	err = query.Notification.WithContext(c).Save(
		&entity.Notification{
			ID:      *flakeId,
			Cid:     cid,
			Content: content,
			File:    file,
		},
	)
	if err != nil {
		hlog.Error("pg存通知时鼠了: ", err)
		return nil, err
	}

	//找课程域内学生
	userInCourses, err := query.UserInCourse.WithContext(c).Where(query.UserInCourse.CourseID.Eq(cid)).Find()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &base.BaseResponse{
				Code: 200,
				Msg:  "通知已迭达",
			}, nil
		} else {
			hlog.Error(" db-user_course 查询鼠了: ", err)
			return nil, err
		}
	}

	for _, item := range userInCourses {

		recordKey := redis.GenUserNotificationRecordKey(item.UserID)
		exists, err := redis.Client.R.Exists(c, recordKey).Result()
		if err != nil {
			hlog.Error("UserNotificationRecord redis的记录查询存在爆了: ", err)
			return nil, err
		}
		//存在记录表时加上一个未读记录
		if exists > 0 {
			record := redis.UserNotificationRecord{}
			err := redis.Client.GetValue(c, recordKey, record)
			if err != nil {
				hlog.Error("UserNotification  redis的记录查询爆了:: ", err)
				return nil, err
			}
			record.Notifications = append(record.Notifications, &base.NotificationInfo{
				Content:  content,
				File:     file,
				Cid:      strconv.FormatInt(cid, 10),
				Favorite: 0,
				Read_:    false,
				ID:       strconv.FormatInt(*flakeId, 10),
			})
			redis.Client.SetValue(c, recordKey, record)
		} else { //生成一个新的表
			var notifications []*base.NotificationInfo
			newRecord := redis.UserNotificationRecord{
				Uid:           item.UserID,
				Notifications: notifications,
			}
			newRecord.Notifications = append(newRecord.Notifications, &base.NotificationInfo{
				Content:  content,
				File:     file,
				Cid:      strconv.FormatInt(cid, 10),
				Favorite: 0,
				Read_:    false,
				ID:       strconv.FormatInt(*flakeId, 10),
			})
			redis.Client.SetValue(c, recordKey, newRecord)
		}
	}
	return &base.BaseResponse{
		Code: 200,
		Msg:  "通知已迭达",
	}, nil

}

func (s *NotificationService) BrowseNotification(
	c context.Context,
	uid int64,
	nid int64,
) (*notification.BrowseNotificationResp, error) {

	recordKey := redis.GenUserNotificationRecordKey(uid)
	//数据库拿记通知信息
	dbNotification, err := query.Notification.WithContext(c).Where(query.Notification.ID.Eq(nid)).First()

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			hlog.Error("不是哥们，数据库都妹存这通知啊: ", err)
			return nil, err
		} else {
			hlog.Error("不是哥们，数据库怎么了: ", err)
			return nil, err
		}

	}

	resNotification := &base.NotificationInfo{
		Content:  dbNotification.Content,
		File:     dbNotification.File,
		Cid:      strconv.FormatInt(dbNotification.Cid, 10),
		Favorite: dbNotification.Favorite,
		Read_:    true,
		ID:       strconv.FormatInt(dbNotification.ID, 10),
	}

	exist, err := redis.Client.R.Exists(c, recordKey).Result()
	if err != nil {
		hlog.Error("redis查用户通知是否存在时鼠了: ", err)
		return nil, err
	}
	if exist <= 0 { //用户没有收到过通知，直接不处理记录
		return &notification.BrowseNotificationResp{
			Base: &base.BaseResponse{
				Code: 200,
				Msg:  "查询成功",
			},
			Notification: resNotification,
		}, nil
	} else { //更新缓存里的通知记录状态
		record := redis.UserNotificationRecord{}

		err := redis.Client.GetValue(c, recordKey, &record)
		if err != nil {
			hlog.Error("redis查用户通知赋值时鼠了: ", err)
			return nil, err
		}

		found := false
		for i := range record.Notifications {
			if record.Notifications[i].ID == resNotification.ID {
				record.Notifications[i].Read_ = true
				found = true
				break
			}
		}

		if !found { //如果用户有过通知，还是选择把通知加进去?
			hlog.Warnf("通知ID %s 未在Redis记录中找到，可能缓存未更新", resNotification.ID)
			//record.Notifications = append(record.Notifications, resNotification) // 自动修复缓存?
		}

		redis.Client.SetValue(c, recordKey, record)

		return &notification.BrowseNotificationResp{
			Base: &base.BaseResponse{
				Code: 200,
				Msg:  "查询成功",
			},
			Notification: resNotification,
		}, nil
	}

}
