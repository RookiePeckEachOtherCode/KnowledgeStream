package utils

import "time"

func GetNowTime() (string, error) {
	timeStr := time.Now().Format("2006-01-02 15:04:05")
	return timeStr, nil
}
