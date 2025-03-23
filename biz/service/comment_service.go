package service

import (
	"context"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/utils"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"strconv"
	"sync"
)

var (
	commentServiceOnce sync.Once
	commentService     *CommentService
)

func CommentServ() *CommentService {
	commentServiceOnce.Do(func() {
		commentService = &CommentService{}
	})
	return commentService
}

type CommentService struct {
}

func (s *CommentService) CrateComment(c context.Context, name string, avatar string, content string, parent int64, ascription int64) (*base.BaseResponse, error) {
	flakeId, err := utils.NextSnowFlakeId()
	if err != nil {
		hlog.Error("生成评论id失败: ", err)
		return nil, err
	}

	err = query.Comment.WithContext(c).Save(
		&entity.Comment{
			ID:         *flakeId,
			Ascription: ascription,
			Avatar:     avatar,
			Name:       name,
			Content:    content,
			Parent:     parent,
		},
	)

	if err != nil {
		hlog.Error("保存评论到数据库失败: ", err)
		return nil, err
	}
	return &base.BaseResponse{
		Code: 200,
		Msg:  "创建成功",
	}, nil

}

func (s *CommentService) QueryCommentsWithParentId(
	c context.Context,
	parent int64,
) ([]*base.CommentInfo, error) {

	comments, err := query.Comment.WithContext(c).Where(query.Comment.Parent.Eq(parent)).Find()

	if err != nil {
		hlog.Error("查询数据库评论失败: ", err)
		return nil, err
	}

	resp := make([]*base.CommentInfo, 0)

	for _, item := range comments {
		resp = append(resp, &base.CommentInfo{
			ID:         strconv.FormatInt(item.ID, 10),
			Ascription: strconv.FormatInt(item.Ascription, 10),
			Name:       item.Name,
			Content:    item.Content,
			Parent:     strconv.FormatInt(item.Parent, 10),
		})
	}
	return resp, nil
}
