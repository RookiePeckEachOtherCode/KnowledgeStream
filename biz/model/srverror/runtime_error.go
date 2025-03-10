package srverror

import "errors"

type RuntimeError error

func NewRuntimeError(msg string) RuntimeError {
	return errors.New(msg)
}
