import { RequestParams } from '../types/API';

export const API_URL = import.meta.env.VITE_API_URL;

export const APICall = async (requestParams: RequestParams) => {
    const response = await fetch(API_URL + requestParams.path, {
        method: requestParams.method,
        headers: {
            "Accept": "*/*",
            "Access-Control-Allow-Origin": "*",
            ...(requestParams.multipart ? {} : {"Content-Type": "application/json"}),
            ...requestParams.headers
        },
        body: requestParams.body ? (requestParams.multipart ? requestParams.body as FormData : JSON.stringify(requestParams.body)) : null
    });

    const responseJSON = await response.json();

    if (!response.ok) {
        return {
            status: response.status,
            description: responseJSON.detail
        };
    }

    return {
        status: response.status,
        ...responseJSON
    };
};