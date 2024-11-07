import axios, { AxiosResponse } from 'axios';
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import requestQueue from "@/utils/rest-queue";
//
export const baseURL = 'http://127.0.0.1:8000/api';
export const nextBaseURL = 'http://localhost:3000';
// export const baseURL = 'https://flexprojectsapi.int.cits.co.tz/api';
// export const nextBaseURL = 'https://flexprojects.int.cits.co.tz';

// Axios instance
const index = axios.create({
    baseURL,
});

// Function to get headers for authenticated requests
export const config = (token: string | undefined | null, isFormData?: boolean) => {
    const _token = getValueFromLocalStorage('token');
    const strippedToken = _token?.substring(1, _token.length - 1);

    return {
        headers: {
            "Content-Type": isFormData ? 'multipart/form-data':"application/json",
            "Accept": "*",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `${strippedToken && `Bearer ${strippedToken}`}`,
        }
    };
};

// Helper function to introduce delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry request with exponential backoff
const requestWithRetry = async <T>(requestFn: () => Promise<T>, retries = 5): Promise<T | null> => {
    let attempt = 0;
    let delayTime = 1000; // Start with a 1-second delay

    while (attempt < retries) {
        try {
            return await requestFn();
        } catch (error: any) {
            // Check if the error is related to rate limiting (429 status)
            if (error.response?.status === 429 && attempt < retries - 1) {
                console.log(`Request failed. Retrying in ${delayTime / 1000} seconds...`);
                await delay(delayTime); // Wait before retrying
                delayTime *= 2; // Exponentially increase delay time
                attempt++;
            } else {
                throw error; // Throw error if not 429 or retry limit reached
            }
        }
    }
    return null;
};

// Request method implementations
const get = async <T>(url?: string, token?: string | null): Promise<any> => {
    return url && await requestWithRetry(() => requestQueue.pushRequest(() => index.get(url, config(token))));
};

const post = async <T>(url: string, data: any, token?: string | null, isFormData?: boolean): Promise<any> => {
    return url && await requestWithRetry(() => requestQueue.pushRequest(() => index.post(url, data, config(token, isFormData))));
};

const put = async <T>(url: string, data: any, token?: string | null): Promise<any> => {
    return url && await requestWithRetry(() => requestQueue.pushRequest(() => index.put(url, data, config(token))));
};

const remove = async <T>(url: string, token?: string | null): Promise<any> => {
    return url && await requestWithRetry(() => requestQueue.pushRequest(() => index.delete(url, config(token))));
};

export { get, post, put, remove };
