export type RequestParams = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    headers: {
        [key: string]: any
    } | null,
    body: {
        [key: string]: any
    } | null
};