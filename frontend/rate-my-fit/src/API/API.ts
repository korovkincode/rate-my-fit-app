import { RequestParams } from '../types/API';

export const API_URL = 'http://localhost:8080';

export const APICall = async (requestParams: RequestParams) => {
    const response = await fetch(API_URL + requestParams.path, {
        method: requestParams.method,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            ...requestParams.headers
        },
        body: requestParams.body ? JSON.stringify(requestParams.body) : null
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
}