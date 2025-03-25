import { Api } from "./internal/api";

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API ?? "http://localhost:8888";

export const api = new Api(async ({ uri, method, headers, body }) => {
  const isGetRequest = method === 'GET' || method === 'HEAD';
  const processedUrl = isGetRequest && body
      ? `${BASE_URL}${uri}?${new URLSearchParams(body).toString()}`
      : `${BASE_URL}${uri}`;
  
  const config: RequestInit = {
    method,
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: localStorage.getItem("token") ?? "",
      ...headers,
    }
  };
  
  if (!isGetRequest && body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(processedUrl, config);

  if (response.status !== 200) {
    throw response.json();
  }
  const text = await response.text();

  if (text.length === 0) {
    return null;
  }

  const resp = JSON.parse(text);
  if (resp.base.code === 401) {
    document.location.replace("/auth/login");
  }
  return resp;
});
