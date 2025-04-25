FROM golang:alpine AS builder
WORKDIR /app/build
COPY . .
ENV GO111MODULE=on
ENV GOPROXY="https://goproxy.io"
RUN go mod tidy
RUN go build -o server .

FROM alpine
WORKDIR /app
COPY --from=builder /app/build/server .
EXPOSE 8888

ENTRYPOINT ["./server"]





