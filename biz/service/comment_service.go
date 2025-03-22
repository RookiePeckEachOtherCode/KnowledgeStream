package service

import "sync"

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
