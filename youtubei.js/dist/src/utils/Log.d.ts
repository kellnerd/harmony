export declare const Level: {
    NONE: number;
    ERROR: number;
    WARNING: number;
    INFO: number;
    DEBUG: number;
};
export declare const warnOnce: (id: string, ...args: any[]) => void;
export declare const warn: (tag?: string, ...args: any[]) => void;
export declare const error: (tag?: string, ...args: any[]) => void;
export declare const info: (tag?: string, ...args: any[]) => void;
export declare const debug: (tag?: string, ...args: any[]) => void;
export declare function setLevel(...args: number[]): void;
