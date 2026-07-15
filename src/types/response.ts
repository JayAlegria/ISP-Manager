
export type TActionResponse<T = null> = {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
};
