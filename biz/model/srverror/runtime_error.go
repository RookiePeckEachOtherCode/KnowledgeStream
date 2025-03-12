package srverror

type RuntimeError struct {
	Msg string
}

func (e *RuntimeError) Error() string {
	return e.Msg
}

func NewRuntimeError(msg string) *RuntimeError {
	return &RuntimeError{Msg: msg}
}
