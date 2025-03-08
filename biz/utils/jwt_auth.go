package utils

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/config"
	"github.com/dgrijalva/jwt-go"
)

type Claims struct {
	UserId    int64                `json:"user_id"`
	Authority entity.AuthorityEnum `json:"authority"`
	jwt.StandardClaims
}

func GenerateToken(Id int64, authority entity.AuthorityEnum, expiresIn ...time.Duration) string {
	expire := config.Get().JWT.Expiration * 24
	defaultExpire := time.Hour * time.Duration(expire)
	if len(expiresIn) > 0 {
		defaultExpire = expiresIn[0]
	}

	claims := &Claims{
		UserId:    Id,
		Authority: authority,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(defaultExpire).Unix(), // 过期时间戳
			IssuedAt:  time.Now().Unix(),                    // 签发时间
			Issuer:    "KnowledgeStream",                    // 签发者
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedString, err := token.SignedString([]byte(config.Get().JWT.Key))
	if err != nil {
		log.Printf("不是哥们,生成Token失败: %v", err)
		return ""
	}
	return signedString
}

func ParseToken(tokenStr string) (*int64, *entity.AuthorityEnum, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("谁把别人家token拿来了: %v", token.Header["alg"])
		}
		return []byte(config.Get().JWT.Key), nil
	})

	if err != nil {
		// 拿具体错误类型
		var ve *jwt.ValidationError
		if errors.As(err, &ve) {
			switch {
			case ve.Errors&jwt.ValidationErrorExpired != 0:
				return nil, nil, fmt.Errorf("飞舞哈基前端没更新token")
			case ve.Errors&jwt.ValidationErrorSignatureInvalid != 0:
				return nil, nil, fmt.Errorf("谁想伪造token")
			default:
				return nil, nil, fmt.Errorf("token怎么了,我不造啊: %v", ve)
			}
		}
		return nil, nil, fmt.Errorf("解析token失败: %v", err)
	}

	if !token.Valid {
		return nil, nil, fmt.Errorf("无效的token")
	}

	return &claims.UserId, &claims.Authority, nil
}
