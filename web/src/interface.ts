import type { AxiosError } from "axios";

export interface Link {
    id: string;
    shortUrl: string;
    originalUrl: string;
    accessCount: number;
};

export type ApiError = AxiosError<{message: string}>;