package redis

import (
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
	"strconv"
)

type UserNotificationRecord struct {
	Uid           int64 `json:"uid"`
	Notifications []*base.NotificationInfo
}

func GenUserNotificationRecordKey(uid int64) string {
	formatInt := strconv.FormatInt(uid, 10)
	return "user-notification-record-" + formatInt

}
