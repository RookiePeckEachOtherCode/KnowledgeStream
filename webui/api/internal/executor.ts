export type Executor = (args: {
  readonly uri: string;
  readonly method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  readonly headers?: { readonly [key: string]: string };
  readonly query?: Record<string, any>; // 新增查询参数
  readonly body?: unknown;
}) => Promise<unknown>;
