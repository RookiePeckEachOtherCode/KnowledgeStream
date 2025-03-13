package utils

import (
	"time"
)

func GetNowTime() (string, error) {
	loc, err := time.LoadLocation("Asia/Shanghai")
	if err != nil {
		return "", err
	}
	now := time.Now().In(loc)
	timeStr := now.Format("2006-01-02 15:04:05")
	return timeStr, nil
}
