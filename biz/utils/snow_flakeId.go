package utils

import (
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/config"
	"github.com/bwmarrin/snowflake"
)

func NextSnowFlakeId() (*int64, error) {
	newNode, err := snowflake.NewNode(config.Get().SnowflakeNode)
	if err != nil {
		return nil, err
	}
	id := newNode.Generate().Int64()
	return &id, nil
}
