// Code generated by hertz generator.

package comment

import (
	middleware "github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/middelware"
	"github.com/cloudwego/hertz/pkg/app"
)

func rootMw() []app.HandlerFunc {
	// your code...
	return nil
}

func _commentMw() []app.HandlerFunc {
	// your code...
	return nil
}

func _querychildrencommentMw() []app.HandlerFunc {
	// your code...
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _makecommentMw() []app.HandlerFunc {
	// your code...
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _querycommentundernotificationMw() []app.HandlerFunc {
	// your code...
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _querycommentundervideoMw() []app.HandlerFunc {
	// your code...
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _commentsMw() []app.HandlerFunc {
	// your code...
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _replycommentMw() []app.HandlerFunc {
	// your code...
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}
