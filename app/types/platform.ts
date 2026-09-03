import { IPaginatedResponse } from "@types";

export interface IParentPlatform {
    platform: {
        id: number;
        name: string;
        slug: string;
    };
}

export interface IPlatform {
    platform: {
        id: number;
        name: string;
        slug: string;
        image_background?: string;
    };
    released_at?: string;
    requirements?: {
        minimum?: string;
        recommended?: string;
    };
}

export type IPlatformResponse = IPaginatedResponse<IPlatform>;