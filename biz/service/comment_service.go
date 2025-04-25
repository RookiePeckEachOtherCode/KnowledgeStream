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
	content = utils.CommentByFilter(content)
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
	count, err := query.Comment.WithContext(c).Where(query.Comment.ID.Eq(parent)).Count()
	if err != nil {
		hlog.Error("查询父级评论失败: ", err)
		return nil, err
	}
	if count > 0 {
		_, err := query.Comment.WithContext(c).Where(query.Comment.ID.Eq(parent)).UpdateSimple(query.Comment.Children.Add(1))
		if err != nil {
			hlog.Error("子评论数自增失败: ", err)
			return nil, err
		}
	}
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
	size ...int64,
) ([]*base.CommentInfo, error) {
	// 初始化查询构造器
	q := query.Q
	commentQuery := query.Comment.WithContext(c)
	var limit = 10
	if len(size) > 0 && size[0] > 0 {
		limit = int(size[0])
	}

	// 关联用户表并选择需要的字段
	comments, err := commentQuery.
		// 联表查询用户表
		LeftJoin(query.User, q.Comment.Ascription.EqCol(q.User.ID)).
		// 选择评论表所有字段 + 用户表的name和avatar
		Select(
			q.Comment.ALL,          // 评论表所有字段
			q.User.Name.As("name"), // 用户表的name覆盖评论表字段
			q.User.Avatar.As("avatar"),
		).
		Where(q.Comment.Parent.Eq(parent)).
		Order(q.Comment.Time).Limit(limit).Find()

	if err != nil {
		hlog.Error("查询评论失败: ", err)
		return nil, err
	}

	// 转换数据结构
	resp := make([]*base.CommentInfo, 0, len(comments))
	for _, item := range comments {
		resp = append(resp, &base.CommentInfo{
			ID:         strconv.FormatInt(item.ID, 10),
			Ascription: strconv.FormatInt(item.Ascription, 10),
			Name:       item.Name, // 来自用户表
			Content:    item.Content,
			Parent:     strconv.FormatInt(item.Parent, 10),
			Avatar:     item.Avatar, // 来自用户表
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
