export interface IBaseState<T = any> {
    isLoading: { [key: string]: boolean };
    data: { [key: string]: T | any };
    error: { [key: string]: any };
    status: { [key: string]: 'idle' | 'loading' | 'success' | 'error' };
    message: { [key: string]: string | undefined };
}