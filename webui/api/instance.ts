import {Api} from "./internal/api";

export const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_API ?? "http://localhost:8888";

export const api = new Api(async ({uri, method, headers, body, query}) => {
    const isGetRequest = method === 'GET'

    const urlSearchParams = new URLSearchParams(query).toString();
    const processedUrl = isGetRequest && query
        ? `${BASE_URL}${uri}?${urlSearchParams}`
        : `${BASE_URL}${uri}`;

    const config: RequestInit = {
        method,
        headers: {
            "content-type": "application/json;charset=UTF-8",
            Authorization: localStorage.getItem("token") ?? "",
            ...headers,
        }
    };

    // 非 GET 请求才处理 body
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
