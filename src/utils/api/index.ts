import axios, {AxiosResponse} from 'axios';
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";

// export const baseURL = 'https://flexprojectsapi.int.cits.co.tz/api';
// export const nextBaseURL = 'https://flexprojects.int.cits.co.tz';
export const baseURL = 'http://127.0.0.1:8000/api';
export const nextBaseURL = 'http://localhost:3000';

const api = axios.create({
    baseURL,
});

export const config = (token: string | undefined | null) => {
    const _token = getValueFromLocalStorage('token')
    const strippedToken = _token?.substring(1, _token.length - 1)

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
    return url && await api.get(url, config(token))
};

const post = async <T>(url: string, data: any, token?: string | null): Promise<any> => {
    return await api.post(url, data, config(token));
};

const put = async <T>(url: string, data: any, token?: string | null): Promise<any> => {
    return await api.put(url, data, config(token));
};

const remove = async <T>(url: string, token?: string | null): Promise<any> => {
    return await api.delete(url, config(token));
};

export { get, post, put, remove };