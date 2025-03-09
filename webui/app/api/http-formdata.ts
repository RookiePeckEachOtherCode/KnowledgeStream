const BaseUrl = ""; 
export const $FormData = async (data: FormData, url: string,method:string) => {
    let headers: Record<string, string> = {};

    const token = localStorage.getItem("token");
    if (token) {
        headers['Authorization'] = `${token}`;
    }
    let fullUrl = `${BaseUrl}${url}`;
    try {
        const response = await fetch(fullUrl, {
            method: method,
            headers: headers,
            body: data,
        });
        return response.json();
    } catch (error) {
        console.error("Error fetching:", error);
        throw error;
    }
};