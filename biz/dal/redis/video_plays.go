package redis

import "strconv"

type VideoPlaysRecord struct {
	Vid   int64 `json:"vid"`
	Plays int32 `json:"plays"`
}

func GenVideoPlaysRecordKey(vid int64) string {
	formatInt := strconv.FormatInt(vid, 10)
	return "video-plays-record-" + formatInt
}
