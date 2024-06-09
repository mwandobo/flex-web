import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
// export const baseURL = 'https://flexprojectsapi.int.cits.co.tz/api';
export const baseURL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL,
});

export const config = (token: string | undefined | null) => {

    const strippedToken = token?.substring(1, token.length - 1)

    return {
        headers: {
            "Content-Type": "application/json",
            "Accept": "*",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `${strippedToken && `Bearer ${strippedToken}`}`,
        }
    }
};

// Define common request methods
const get = async <T>(url?: string, token?: string | null): Promise<any> => {
    const response = url && await api.get(url, config(token));
    return response
};

const post = async <T>(url: string, data: any, token?: string | null): Promise<any> => {
    const response = await api.post(url, data, config(token));
    return response;
};

const put = async <T>(url: string, data: any, token?: string | null): Promise<any> => {
    const response: AxiosResponse<T> = await api.put(url, data, config(token));
    return response;
};

const remove = async <T>(url: string, token?: string | null): Promise<any> => {
    const response: AxiosResponse<T> = await api.delete(url, config(token));
    return response;
};

export { get, post, put, remove };