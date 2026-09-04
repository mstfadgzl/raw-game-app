import { IDeveloper, IPaginatedResponse } from "@types";
import { IParentPlatform, IPlatform } from "./platform";



export interface IGenre {
    id: number;
    name: string;
    slug: string;
    image_background: string;
    games_count: number;
}
export interface ITag {
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: number;
    image_background: string;
}

export interface IGame {
    id: number;
    slug: string;
    name: string;
    released: string;
    background_image: string;
    rating: number;
    metacritic: number;
    added: number;
    playtime: number;
    parent_platforms?: IParentPlatform[];
    platforms?: IPlatform[];
    genres?: IGenre[];
    tags?: ITag[];
}

export interface IGameDetail extends IGame {
    description_raw: string;
    achievement_count: number;
    reddit_url: string;
    reddit_name: string;
    reddit_description: string;
    metacritic_url: string;
    metacritic_platforms: {
        metascore: number;
        url: string;
        platform: {
            platform: number;
            name: string;
            slug: string;
        };
    }[];
    website: string;
    dominant_color: string;
    saturated_color: string;
    developers: IDeveloper[];
    publishers: IDeveloper[];
    stores: {
        id: number;
        store: {
            id: number;
            name: string;
            domain: string;
            slug: string;
        };
    }[];
}
export interface IScreenshot {
    id: number;
    image: string;
    width: number;
    height: number;
}


export interface ITrailer {
    id: number;
    name: string;
    preview: string;
    data: {
        480: string;
        max: string;
    };
}

export interface IAchievement {
    id: number;
    name: string;
    description: string;
    image: string;
    percent: string;
}

export type IAchievementResponse = IPaginatedResponse<IAchievement>;
export type ITrailerResponse = IPaginatedResponse<ITrailer>;
export type IGameListResponse = IPaginatedResponse<IGame>;
export type IScreenshotResponse = IPaginatedResponse<IScreenshot>;
export type IGenreResponse = IPaginatedResponse<IGenre>;
export type ITagResponse = IPaginatedResponse<ITag>;
