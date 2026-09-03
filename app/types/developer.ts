import { IPaginatedResponse } from "@types";

export interface IDeveloper {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
    description: string;
}
//IPublisher yapısı IDeveloper ile aynı olduğu için ayrı ayrı yazmana gerek yok

export type IDeveloperResponse = IPaginatedResponse<IDeveloper>;