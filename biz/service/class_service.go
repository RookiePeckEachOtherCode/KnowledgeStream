package service

import (
	"context"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/class"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"gorm.io/gorm/clause"
	"net/http"
	"sync"
)

var (
	classServiceOnce sync.Once
	classService     *ClassService
)

func ClassServ() *ClassService {
	classServiceOnce.Do(func() {
		classService = &ClassService{}
	})
	return classService
}

type ClassService struct {
}

func (s *ClassService) AddClass(c context.Context, name string) (*class.AddClassResp, error) {
	response := class.AddClassResp{
		Base: base.NewBaseResponse(),
	}
	err := query.Class.WithContext(c).Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "class_name"}},
		DoNothing: true,
	}).Create(&entity.Class{ClassName: name})
	
	if err != nil {
		response.Base.Msg = err.Error()
		response.Base.Code = http.StatusBadRequest
		hlog.Error("保存班级失败: ", err)
		return &response, err
	}
	response.Base.Msg = "保存成功"
	response.Base.Code = http.StatusOK
	return &response, nil

}

func (s *ClassService) QueryClass(
	c context.Context,
	keyword string,
	offset int32,
	size int32,
) (*class.QueryClassResp, error) {

	resp := class.QueryClassResp{
		Base:    base.NewBaseResponse(),
		Classes: *new([]string),
	}

	classes, err := query.Class.
		WithContext(c).
		Where(query.Class.ClassName.Like("%" + keyword + "%")).
		Offset(int(offset)).
		Limit(int(size)).Find()

	if err != nil {
		resp.Base.Msg = err.Error()
		resp.Base.Code = http.StatusBadRequest
		hlog.Error("数据库查询失败: ", err)
		return &resp, err
	}

	for _, item := range classes {
		resp.Classes = append(resp.Classes, item.ClassName)
	}
	resp.Base.Msg = "查询成功"
	resp.Base.Code = http.StatusOK
	return &resp, nil

}
