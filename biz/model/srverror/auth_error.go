package srverror

type AuthError struct {
	Msg string
}

func (e *AuthError) Error() string {
	return e.Msg
}

func NewAuthError(msg string) *AuthError {
	return &AuthError{Msg: msg}
}
