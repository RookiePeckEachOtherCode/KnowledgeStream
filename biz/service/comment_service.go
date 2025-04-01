package service

import (
	"context"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/utils"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"gorm.io/gorm"
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
	timestr, err := utils.GetNowTime()
	if err != nil {
		hlog.Error("时间生成失败: ", err)
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
			Time:       timestr,
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
	size ...int64, // 使用可变参数实现可选参数
) ([]*base.CommentInfo, error) {

	// 初始化查询构造器
	queryBuilder := query.Comment.
		WithContext(c).
		Where(query.Comment.Parent.Eq(parent))

	// 处理 size 参数
	if len(size) > 0 && size[0] > 0 {
		// 将 int64 转换为 GORM 需要的 int 类型
		queryBuilder = queryBuilder.Limit(int(size[0]))
	}

	// 执行查询
	comments, err := queryBuilder.Find()
	if err != nil {
		hlog.Error("查询数据库评论失败: ", err)
		return nil, err
	}

	// 转换数据结构
	resp := make([]*base.CommentInfo, 0, len(comments))
	for _, item := range comments {
		resp = append(resp, &base.CommentInfo{
			ID:         strconv.FormatInt(item.ID, 10),
			Ascription: strconv.FormatInt(item.Ascription, 10),
			Name:       item.Name,
			Content:    item.Content,
			Parent:     strconv.FormatInt(item.Parent, 10),
			Avatar:     item.Avatar,
			Time:       item.Time,
			Children:   item.Children,
		})
	}

	return resp, nil
}

func (s *CommentService) AddCommentChildren(c context.Context, parent int64) (*base.BaseResponse, error) {
	_, err := query.Comment.
		WithContext(c).
		Where(query.Comment.ID.Eq(parent)).
		Update(query.Comment.Children, gorm.Expr("children + 1"))

	if err != nil {
		hlog.Error("保存评论到数据库失败: ", err)
		return nil, err
	}
	return &base.BaseResponse{
		Code: 200,
		Msg:  "创建成功",
	}, nil
}
