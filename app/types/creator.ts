import { IPaginatedResponse } from "@types";

export interface ICreatorPositions {
    id: number;
    name: string;
    slug: string;
}
export interface ICreator {
    id: number;
    name: string;
    image: string;
    image_background: string;
    description: string;
    games_count: number;
    rating: string;
    positions: ICreatorPositions[];
}

export type ICreatorResponse = IPaginatedResponse<ICreator>;
