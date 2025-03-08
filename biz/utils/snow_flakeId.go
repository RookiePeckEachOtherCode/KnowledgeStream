package utils

import (
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/configs"
	"github.com/bwmarrin/snowflake"
)

func GenSnowFlakeId() (*int64, error) {
	newNode, err := snowflake.NewNode(configs.SnowFlakeNode)
	if err != nil {
		return nil, err
	}
	id := newNode.Generate().Int64()
	return &id, nil
}
