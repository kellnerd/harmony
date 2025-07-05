export declare const URLS: {
    readonly YT_BASE: "https://www.youtube.com";
    readonly YT_MUSIC_BASE: "https://music.youtube.com";
    readonly YT_SUGGESTIONS: "https://suggestqueries-clients6.youtube.com";
    readonly YT_UPLOAD: "https://upload.youtube.com/";
    readonly API: {
        readonly BASE: "https://youtubei.googleapis.com";
        readonly PRODUCTION_1: "https://www.youtube.com/youtubei/";
        readonly PRODUCTION_2: "https://youtubei.googleapis.com/youtubei/";
        readonly STAGING: "https://green-youtubei.sandbox.googleapis.com/youtubei/";
        readonly RELEASE: "https://release-youtubei.sandbox.googleapis.com/youtubei/";
        readonly TEST: "https://test-youtubei.sandbox.googleapis.com/youtubei/";
        readonly CAMI: "http://cami-youtubei.sandbox.googleapis.com/youtubei/";
        readonly UYTFE: "https://uytfe.sandbox.google.com/youtubei/";
    };
    readonly GOOGLE_SEARCH_BASE: "https://www.google.com/";
};
export declare const OAUTH: {
    readonly REGEX: {
        readonly TV_SCRIPT: RegExp;
        readonly CLIENT_IDENTITY: RegExp;
    };
};
export declare const CLIENTS: {
    readonly IOS: {
        readonly NAME: "iOS";
        readonly VERSION: "20.11.6";
        readonly USER_AGENT: "com.google.ios.youtube/20.11.6 (iPhone10,4; U; CPU iOS 16_7_7 like Mac OS X)";
        readonly DEVICE_MODEL: "iPhone10,4";
        readonly OS_NAME: "iOS";
        readonly OS_VERSION: "16.7.7.20H330";
    };
    readonly WEB: {
        readonly NAME: "WEB";
        readonly VERSION: "2.20250222.10.00";
        readonly API_KEY: "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
        readonly API_VERSION: "v1";
        readonly STATIC_VISITOR_ID: "6zpwvWUNAco";
        readonly SUGG_EXP_ID: "ytzpb5_e2,ytpo.bo.lqp.elu=1,ytpo.bo.lqp.ecsc=1,ytpo.bo.lqp.mcsc=3,ytpo.bo.lqp.mec=1,ytpo.bo.lqp.rw=0.8,ytpo.bo.lqp.fw=0.2,ytpo.bo.lqp.szp=1,ytpo.bo.lqp.mz=3,ytpo.bo.lqp.al=en_us,ytpo.bo.lqp.zrm=1,ytpo.bo.lqp.er=1,ytpo.bo.ro.erl=1,ytpo.bo.ro.mlus=3,ytpo.bo.ro.erls=3,ytpo.bo.qfo.mlus=3,ytzprp.ppp.e=1,ytzprp.ppp.st=772,ytzprp.ppp.p=5";
    };
    readonly MWEB: {
        readonly NAME: "MWEB";
        readonly VERSION: "2.20250224.01.00";
        readonly API_VERSION: "v1";
    };
    readonly WEB_KIDS: {
        readonly NAME: "WEB_KIDS";
        readonly VERSION: "2.20250221.11.00";
    };
    readonly YTMUSIC: {
        readonly NAME: "WEB_REMIX";
        readonly VERSION: "1.20250219.01.00";
    };
    readonly ANDROID: {
        readonly NAME: "ANDROID";
        readonly VERSION: "19.35.36";
        readonly SDK_VERSION: 33;
        readonly USER_AGENT: "com.google.android.youtube/19.35.36(Linux; U; Android 13; en_US; SM-S908E Build/TP1A.220624.014) gzip";
    };
    readonly YTSTUDIO_ANDROID: {
        readonly NAME: "ANDROID_CREATOR";
        readonly VERSION: "22.43.101";
    };
    readonly YTMUSIC_ANDROID: {
        readonly NAME: "ANDROID_MUSIC";
        readonly VERSION: "5.34.51";
    };
    readonly TV: {
        readonly NAME: "TVHTML5";
        readonly VERSION: "7.20250219.14.00";
        readonly USER_AGENT: "Mozilla/5.0 (ChromiumStylePlatform) Cobalt/Version";
    };
    readonly TV_SIMPLY: {
        readonly NAME: "TVHTML5_SIMPLY";
        readonly VERSION: "1.0";
    };
    readonly TV_EMBEDDED: {
        readonly NAME: "TVHTML5_SIMPLY_EMBEDDED_PLAYER";
        readonly VERSION: "2.0";
    };
    readonly WEB_EMBEDDED: {
        readonly NAME: "WEB_EMBEDDED_PLAYER";
        readonly VERSION: "1.20250219.01.00";
        readonly API_KEY: "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
        readonly API_VERSION: "v1";
        readonly STATIC_VISITOR_ID: "6zpwvWUNAco";
    };
    readonly WEB_CREATOR: {
        readonly NAME: "WEB_CREATOR";
        readonly VERSION: "1.20241203.01.00";
        readonly API_KEY: "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
        readonly API_VERSION: "v1";
        readonly STATIC_VISITOR_ID: "6zpwvWUNAco";
    };
};
/**
 * The keys correspond to the `NAME` fields in {@linkcode CLIENTS} constant
 */
export declare const CLIENT_NAME_IDS: {
    readonly iOS: "5";
    readonly WEB: "1";
    readonly MWEB: "2";
    readonly WEB_KIDS: "76";
    readonly WEB_REMIX: "67";
    readonly ANDROID: "3";
    readonly ANDROID_CREATOR: "14";
    readonly ANDROID_MUSIC: "21";
    readonly TVHTML5: "7";
    readonly TVHTML5_SIMPLY: "74";
    readonly TVHTML5_SIMPLY_EMBEDDED_PLAYER: "85";
    readonly WEB_EMBEDDED_PLAYER: "56";
    readonly WEB_CREATOR: "62";
};
export declare const STREAM_HEADERS: {
    readonly accept: "*/*";
    readonly origin: "https://www.youtube.com";
    readonly referer: "https://www.youtube.com";
    readonly DNT: "?1";
};
export declare const INNERTUBE_HEADERS_BASE: {
    readonly accept: "*/*";
    readonly 'accept-encoding': "gzip, deflate";
    readonly 'content-type': "application/json";
};
export declare const SUPPORTED_CLIENTS: string[];
