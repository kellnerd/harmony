import type { RawNode } from '../../index.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
import EmojiRun from './EmojiRun.js';
import TextRun from './TextRun.js';
import AccessibilityData from './AccessibilityData.js';
export interface Run {
    text: string;
    toString(): string;
    toHTML(): string;
}
export interface FormattedStringSupportedAccessibilityDatas {
    accessibility_data: AccessibilityData;
}
export declare function escape(text: string): string;
/**
 * Represents text content that may include formatting, emojis, and navigation endpoints.
 */
export default class Text {
    /**
     * The plain text content.
     */
    text?: string;
    /**
     * Individual text segments with their formatting.
     */
    runs?: (EmojiRun | TextRun)[];
    /**
     * Navigation endpoint associated with this text.
     */
    endpoint?: NavigationEndpoint;
    /**
     * Accessibility data associated with this text.
     */
    accessibility?: FormattedStringSupportedAccessibilityDatas;
    /**
     * Indicates if the text is right-to-left.
     */
    rtl: boolean;
    constructor(data: RawNode);
    private isRunsData;
    private parseEndpoint;
    private isObject;
    static fromAttributed(data: AttributedText): Text;
    private static processStyleRuns;
    private static processCommandRuns;
    private static processAttachmentRuns;
    /**
     * Converts the text to HTML.
     * @returns The HTML.
     */
    toHTML(): string | undefined;
    /**
     * Checks if the text is empty.
     * @returns Whether the text is empty.
     */
    isEmpty(): boolean;
    /**
     * Converts the text to a string.
     * @returns The text.
     */
    toString(): string;
}
export interface AttributedText {
    content: string;
    styleRuns?: StyleRun[];
    commandRuns?: CommandRun[];
    attachmentRuns?: AttachmentRun[];
    decorationRuns?: ResponseRun[];
}
interface ResponseRun {
    startIndex: number;
    length: number;
}
interface StyleRun extends Partial<ResponseRun> {
    italic?: boolean;
    weightLabel?: string;
    strikethrough?: string;
    fontFamilyName?: string;
    styleRunExtensions?: {
        styleRunColorMapExtension?: {
            colorMap?: {
                key: string;
                value: number;
            }[];
        };
    };
}
interface CommandRun extends ResponseRun {
    onTap?: RawNode;
}
interface AttachmentRun extends ResponseRun {
    alignment?: string;
    element?: {
        type?: {
            imageType?: {
                image: RawNode;
                playbackState?: string;
            };
        };
        properties?: RawNode;
    };
}
export {};
