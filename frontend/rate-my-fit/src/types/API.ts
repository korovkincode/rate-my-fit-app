export type RequestParams = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    headers: {
        [key: string]: string
    } | null,
    body: {
        [key: string]: any
    } | null
};