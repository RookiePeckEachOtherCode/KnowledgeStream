// Code generated by hertz generator.

package admin

import (
	middleware "github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/middelware"
	"github.com/cloudwego/hertz/pkg/app"
)

func rootMw() []app.HandlerFunc {
	// your code...
	return nil
}

func _adminMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _createcourseMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _deletetargetMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _uploadvideoMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _updateMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _updatecourseinfoMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _updateuserinfoMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _courseMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _deleteuserfromcourseMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _importstudentsMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _queryMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _enquirytcourseMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _enquiryuserMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}

func _enquiryvideoMw() []app.HandlerFunc {
	return []app.HandlerFunc{
		middleware.VerifyToken(),
	}
}
