import NavigationEndpoint from '../NavigationEndpoint.js';
import { type Run } from './Text.js';
import type { RawNode } from '../../index.js';
export default class TextRun implements Run {
    text: string;
    text_color?: number;
    endpoint?: NavigationEndpoint;
    bold: boolean;
    bracket: boolean;
    dark_mode_text_color?: number;
    deemphasize: boolean;
    italics: boolean;
    strikethrough: boolean;
    error_underline: boolean;
    underline: boolean;
    font_face?: 'FONT_FACE_UNKNOWN' | 'FONT_FACE_YT_SANS_MEDIUM' | 'FONT_FACE_ROBOTO_MEDIUM' | 'FONT_FACE_YOUTUBE_SANS_LIGHT' | 'FONT_FACE_YOUTUBE_SANS_REGULAR' | 'FONT_FACE_YOUTUBE_SANS_MEDIUM' | 'FONT_FACE_YOUTUBE_SANS_SEMIBOLD' | 'FONT_FACE_YOUTUBE_SANS_BOLD' | 'FONT_FACE_YOUTUBE_SANS_EXTRABOLD' | 'FONT_FACE_YOUTUBE_SANS_BLACK' | 'FONT_FACE_YT_SANS_BOLD' | 'FONT_FACE_ROBOTO_REGULAR';
    attachment: any;
    constructor(data: RawNode);
    toString(): string;
    toHTML(): string;
}
