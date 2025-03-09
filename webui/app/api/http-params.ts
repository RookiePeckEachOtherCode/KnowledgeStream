const BaseUrl = "";

export const $Params = async (
    method: string,
    url: string,
    data: any,
) => {
    let headers: Record<string, string> = {};

    try {
        const token = localStorage.getItem("token");
        if (token !== undefined) {
            headers['Authorization'] = `${token}`;
        }

        let fullUrl = `${BaseUrl}${url}`;

            headers['Content-Type'] = 'application/json';
            const queryParams = new URLSearchParams(data).toString();
            fullUrl += queryParams ? `?${queryParams}` : '';

        const response = await fetch(fullUrl, {
            method: method,
            headers: headers,
        });

        return await response.json();

    } finally {
        
    }
};