import { VisitorData } from '../../protos/generated/misc/params.js';
export type CommentActionParamsArgs = {
    comment_id?: string;
    video_id?: string;
    text?: string;
    target_language?: string;
};
export declare function encodeVisitorData(id: string, timestamp: number): string;
export declare function decodeVisitorData(visitor_data: string): VisitorData;
export declare function encodeCommentActionParams(type: number, args?: CommentActionParamsArgs): string;
export declare function encodeNextParams(video_ids: string[]): string;
