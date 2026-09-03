export interface IRedditPost {
    id: number;
    name: string;
    text: string;
    image: string | null;
    url: string;
    username: string;
    created: string;
}
export interface IRedditResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IRedditPost[];
}