import { IAchievementResponse, ICreatorResponse, IDeveloperResponse, IGameDetail, IGameListResponse, IGenreResponse, IRedditResponse, IScreenshotResponse, ITagResponse, ITrailerResponse } from "@types";

export interface IBaseState<T = any> {
    isLoading: { [key: string]: boolean };
    data: { [key: string]: T | any };
    error: { [key: string]: any };
    status: { [key: string]: 'idle' | 'loading' | 'success' | 'error' };
    message: { [key: string]: string | undefined };
}

export interface IGameState {
    isLoading: { [key: string]: boolean };
    data: {
        getGamesProcess?: IGameListResponse;
        getGameDetailProcess?: IGameDetail;
        getGameScreenshotsProcess?: IScreenshotResponse;
        getGameTrailersProcess?: ITrailerResponse;
        getGameAchievementsProcess?: IAchievementResponse;
        getGameRedditPostsProcess?: IRedditResponse;
        getGenresProcess?: IGenreResponse;
        getTagsProcess?: ITagResponse;
        getCreatorsProcess?: ICreatorResponse;
        getDevelopersProcess?: IDeveloperResponse;
    };
    error: { [key: string]: any };
    status: { [key: string]: string };
}