import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface ClientInfo {
    hl?: string | undefined;
    gl?: string | undefined;
    remoteHost?: string | undefined;
    deviceId?: string | undefined;
    debugDeviceIdOverride?: string | undefined;
    carrierGeo?: string | undefined;
    crackedHl?: boolean | undefined;
    deviceMake?: string | undefined;
    deviceModel?: string | undefined;
    visitorData?: string | undefined;
    userAgent?: string | undefined;
    clientName?: number | undefined;
    clientVersion?: string | undefined;
    osName?: string | undefined;
    osVersion?: string | undefined;
    projectId?: string | undefined;
    acceptLanguage?: string | undefined;
    acceptRegion?: string | undefined;
    originalUrl?: string | undefined;
    rawDeviceId?: string | undefined;
    configData?: string | undefined;
    spacecastToken?: string | undefined;
    internalGeo?: string | undefined;
    screenWidthPoints?: number | undefined;
    screenHeightPoints?: number | undefined;
    screenWidthInches?: number | undefined;
    screenHeightInches?: number | undefined;
    screenPixelDensity?: number | undefined;
    platform?: number | undefined;
    spacecastClientInfo?: ClientInfo_SpacecastClientInfo | undefined;
    clientFormFactor?: ClientInfo_ClientFormFactor | undefined;
    forwardedFor?: string | undefined;
    mobileDataPlanInfo?: ClientInfo_MobileDataPlanInfo | undefined;
    /** e.g. 241757026 */
    gmscoreVersionCode?: number | undefined;
    webpSupport?: boolean | undefined;
    cameraType?: ClientInfo_CameraType | undefined;
    experimentsToken?: string | undefined;
    windowWidthPoints?: number | undefined;
    windowHeightPoints?: number | undefined;
    configInfo?: ClientInfo_ConfigGroupsClientInfo | undefined;
    unpluggedLocationInfo?: ClientInfo_UnpluggedLocationInfo | undefined;
    androidSdkVersion?: number | undefined;
    screenDensityFloat?: number | undefined;
    firstTimeSignInExperimentIds?: number | undefined;
    utcOffsetMinutes?: number | undefined;
    animatedWebpSupport?: boolean | undefined;
    kidsAppInfo?: ClientInfo_KidsAppInfo | undefined;
    musicAppInfo?: ClientInfo_MusicAppInfo | undefined;
    tvAppInfo?: ClientInfo_TvAppInfo | undefined;
    internalGeoIp?: string | undefined;
    unpluggedAppInfo?: ClientInfo_UnpluggedAppInfo | undefined;
    locationInfo?: ClientInfo_LocationInfo | undefined;
    contentSizeCategory?: string | undefined;
    fontScale?: number | undefined;
    userInterfaceTheme?: ClientInfo_UserInterfaceTheme | undefined;
    timeZone?: string | undefined;
    homeGroupInfo?: ClientInfo_HomeGroupInfo | undefined;
    emlTemplateContext?: Uint8Array | undefined;
    coldAppBundleConfigData?: Uint8Array | undefined;
    /** repeated ExperimentsHeterodyne.ExperimentIds heterodyne_ids = 86; */
    browserName?: string | undefined;
    browserVersion?: string | undefined;
    locationPlayabilityToken?: string | undefined;
    /** e.g. "qcom;taro" */
    chipset?: string | undefined;
    firmwareVersion?: string | undefined;
    memoryTotalKbytes?: number | undefined;
    mainAppWebInfo?: ClientInfo_MainAppWebInfo | undefined;
    notificationPermissionInfo?: ClientInfo_NotificationPermissionInfo | undefined;
    deviceBrand?: string | undefined;
    /**
     * optional ClientStoreInfo client_store_info = 99;
     * optional SRSDataPushVersion srs_datapush_build_ids = 100;
     * optional PlayerDataPushVersion player_datapush_build_ids = 101;
     */
    glDeviceInfo?: ClientInfo_GLDeviceInfo | undefined;
}
export declare enum ClientInfo_ClientFormFactor {
    /** UNKNOWN_FORM_FACTOR - @TODO: Check these. */
    UNKNOWN_FORM_FACTOR = 0,
    FORM_FACTOR_VAL1 = 1,
    FORM_FACTOR_VAL2 = 2,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_CameraType {
    UNKNOWN_CAMERA_TYPE = 0,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_UserInterfaceTheme {
    USER_INTERFACE_THEME_DARK = 0,
    USER_INTERFACE_THEME_LIGHT = 1,
    UNRECOGNIZED = -1
}
export interface ClientInfo_MainAppWebInfo {
    graftUrl?: string | undefined;
    pwaInstallabilityStatus?: ClientInfo_MainAppWebInfo_PwaInstallabilityStatus | undefined;
    webDisplayMode?: ClientInfo_MainAppWebInfo_WebDisplayMode | undefined;
    isWebNativeShareAvailable?: boolean | undefined;
    storeDigitalGoodsApiSupportStatus?: ClientInfo_MainAppWebInfo_StoreDigitalGoodsApiSupportStatus | undefined;
}
export declare enum ClientInfo_MainAppWebInfo_StoreDigitalGoodsApiSupportStatus {
    STORE_DIGITAL_GOODS_API_SUPPORT_STATUS_VAL0 = 0,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_MainAppWebInfo_PwaInstallabilityStatus {
    PWA_INSTALLABILITY_STATUS_UNKNOWN = 0,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_MainAppWebInfo_WebDisplayMode {
    WEB_DISPLAY_MODE_UNKNOWN = 0,
    UNRECOGNIZED = -1
}
export interface ClientInfo_NotificationPermissionInfo {
    notificationsSetting?: ClientInfo_NotificationPermissionInfo_NotificationsSetting | undefined;
    lastDeviceOptInChangeTimeAgoSec?: number | undefined;
}
export declare enum ClientInfo_NotificationPermissionInfo_NotificationsSetting {
    NOTIFICATIONS_SETTING_UNKNOWN = 0,
    UNRECOGNIZED = -1
}
export interface ClientInfo_GLDeviceInfo {
    glRenderer?: string | undefined;
    glEsVersionMajor?: number | undefined;
    glEsVersionMinor?: number | undefined;
}
export interface ClientInfo_SpacecastClientInfo {
    appliances?: ClientInfo_SpacecastClientInfo_SpacecastAppliance | undefined;
    interactionLevel?: ClientInfo_SpacecastClientInfo_SpacecastInteractionLevel | undefined;
}
export declare enum ClientInfo_SpacecastClientInfo_SpacecastInteractionLevel {
    UNKNOWN = 0,
    UNRECOGNIZED = -1
}
export interface ClientInfo_SpacecastClientInfo_SpacecastAppliance {
    contentProfileToken?: Uint8Array | undefined;
    status?: ClientInfo_SpacecastClientInfo_SpacecastAppliance_OperationalStatus | undefined;
    hostname?: string | undefined;
    active?: boolean | undefined;
    deviceId?: string | undefined;
}
export declare enum ClientInfo_SpacecastClientInfo_SpacecastAppliance_OperationalStatus {
    UNKNOWN = 0,
    UNRECOGNIZED = -1
}
export interface ClientInfo_MobileDataPlanInfo {
    cpid?: string | undefined;
    serializedDataPlanStatus?: string | undefined;
    dataSavingQualityPickerEnabled?: boolean | undefined;
    mccmnc?: string | undefined;
}
export interface ClientInfo_ConfigGroupsClientInfo {
    coldConfigData?: string | undefined;
    coldHashData?: string | undefined;
    hotHashData?: string | undefined;
    appInstallData?: string | undefined;
}
export interface ClientInfo_UnpluggedLocationInfo {
    latitudeE7?: number | undefined;
    longitudeE7?: number | undefined;
    localTimestampMs?: number | undefined;
    ipAddress?: string | undefined;
    timezone?: string | undefined;
    prefer24HourTime?: boolean | undefined;
    locationRadiusMeters?: number | undefined;
    isInitialLoad?: boolean | undefined;
    browserPermissionGranted?: boolean | undefined;
    clientPermissionState?: number | undefined;
    locationOverrideToken?: string | undefined;
}
export interface ClientInfo_KidsAppInfo {
    contentSettings?: ClientInfo_KidsAppInfo_KidsContentSettings | undefined;
    parentCurationMode?: ClientInfo_KidsAppInfo_KidsParentCurationMode | undefined;
    categorySettings?: ClientInfo_KidsAppInfo_KidsCategorySettings | undefined;
    userEducationSettings?: ClientInfo_KidsAppInfo_KidsUserEducationSettings | undefined;
}
export declare enum ClientInfo_KidsAppInfo_KidsParentCurationMode {
    KPCM_UNKNOWN = 0,
    UNRECOGNIZED = -1
}
export interface ClientInfo_KidsAppInfo_KidsContentSettings {
    kidsNoSearchMode?: ClientInfo_KidsAppInfo_KidsContentSettings_YTKidsNoSearchMode | undefined;
    ageUpMode?: ClientInfo_KidsAppInfo_KidsContentSettings_YTKidsAgeUpMode | undefined;
    contentDensity?: ClientInfo_KidsAppInfo_KidsContentSettings_KidsContentDensity | undefined;
}
export declare enum ClientInfo_KidsAppInfo_KidsContentSettings_YTKidsNoSearchMode {
    YT_KIDS_NO_SEARCH_MODE_OFF = 0,
    YT_KIDS_NO_SEARCH_MODE_ON = 1,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_KidsAppInfo_KidsContentSettings_YTKidsAgeUpMode {
    YT_KIDS_AGE_UP_MODE_OFF = 0,
    YT_KIDS_AGE_UP_MODE_ON = 1,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_KidsAppInfo_KidsContentSettings_KidsContentDensity {
    /** YT_KIDS_CONTENT_DENSITY_VAL1 - @TODO: Check these. */
    YT_KIDS_CONTENT_DENSITY_VAL1 = 0,
    YT_KIDS_CONTENT_DENSITY_VAL2 = 1,
    YT_KIDS_CONTENT_DENSITY_VAL3 = 2,
    UNRECOGNIZED = -1
}
export interface ClientInfo_KidsAppInfo_KidsCategorySettings {
    enabledCategories?: string | undefined;
}
export interface ClientInfo_KidsAppInfo_KidsUserEducationSettings {
    hasSeenHomeChipBarUserEducation?: boolean | undefined;
    hasSeenHomePivotBarUserEducation?: boolean | undefined;
    hasSeenParentMuirUserEducation?: boolean | undefined;
}
export interface ClientInfo_MusicAppInfo {
    playBackMode?: ClientInfo_MusicAppInfo_MusicPlayBackMode | undefined;
    musicLocationMasterSwitch?: ClientInfo_MusicAppInfo_MusicLocationMasterSwitch | undefined;
    musicActivityMasterSwitch?: ClientInfo_MusicAppInfo_MusicActivityMasterSwitch | undefined;
    offlineMixtapeEnabled?: boolean | undefined;
    autoOfflineEnabled?: boolean | undefined;
    iosBackgroundRefreshStatus?: ClientInfo_MusicAppInfo_IosBackgroundRefreshStatus | undefined;
    smartDownloadsSongLimit?: number | undefined;
    transitionedFromMixtapeToSmartDownloads?: boolean | undefined;
    pwaInstallabilityStatus?: ClientInfo_MusicAppInfo_PwaInstallabilityStatus | undefined;
    webDisplayMode?: ClientInfo_MusicAppInfo_WebDisplayMode | undefined;
    musicTier?: ClientInfo_MusicAppInfo_MusicTier | undefined;
    storeDigitalGoodsApiSupportStatus?: ClientInfo_MusicAppInfo_StoreDigitalGoodsApiSupportStatus | undefined;
    smartDownloadsTimeSinceLastOptOutSec?: number | undefined;
}
export declare enum ClientInfo_MusicAppInfo_MusicPlayBackMode {
    MPBM_UNKNOWN = 0,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_MusicAppInfo_MusicLocationMasterSwitch {
    MLMS_UNKNOWN = 0,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_MusicAppInfo_MusicActivityMasterSwitch {
    MAMS_UNKNOWN = 0,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_MusicAppInfo_IosBackgroundRefreshStatus {
    UNKNOWN_STATUS = 0,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_MusicAppInfo_PwaInstallabilityStatus {
    PIS_UNKNOWN = 0,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_MusicAppInfo_WebDisplayMode {
    WDM_UNKNOWN = 0,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_MusicAppInfo_MusicTier {
    UNKNOWN_TIER = 0,
    UNRECOGNIZED = -1
}
export declare enum ClientInfo_MusicAppInfo_StoreDigitalGoodsApiSupportStatus {
    SDGAS_UNKNOWN = 0,
    UNRECOGNIZED = -1
}
export interface ClientInfo_TvAppInfo {
    mdxImpactedSessionsServerEvents?: string | undefined;
    enablePrivacyFilter?: boolean | undefined;
    zylonLeftNav?: boolean | undefined;
    certificationScope?: string | undefined;
    livingRoomPoTokenId?: string | undefined;
    jsEngineString?: string | undefined;
    voiceCapability?: ClientInfo_TvAppInfo_VoiceCapability | undefined;
    systemIntegrator?: string | undefined;
    androidBuildFingerprint?: string | undefined;
    cobaltAppVersion?: string | undefined;
    cobaltStarboardVersion?: string | undefined;
    useStartPlaybackPreviewCommand?: boolean | undefined;
    shouldShowPersistentSigninOnHome?: boolean | undefined;
    androidPlayServicesVersion?: string | undefined;
}
export interface ClientInfo_TvAppInfo_VoiceCapability {
    hasSoftMicSupport?: boolean | undefined;
    hasHardMicSupport?: boolean | undefined;
}
export interface ClientInfo_UnpluggedAppInfo {
    enableFilterMode?: boolean | undefined;
    iosNotificationPermission?: boolean | undefined;
    forceEnableEpg3?: boolean | undefined;
}
export interface ClientInfo_LocationInfo {
    locationInfoStatus?: number | undefined;
    ulrStatus?: ClientInfo_LocationInfo_UrlStatus | undefined;
    latitudeE7?: string | undefined;
    longitudeE7?: string | undefined;
    horizontalAccuracyMeters?: string | undefined;
    locationFreshnessMs?: string | undefined;
    locationPermissionAuthorizationStatus?: number | undefined;
    locationOverrideToken?: string | undefined;
    forceLocationPlayabilityTokenRefresh?: boolean | undefined;
}
export interface ClientInfo_LocationInfo_UrlStatus {
    reportingEnabledSetting?: number | undefined;
    historyEnabledSetting?: number | undefined;
    isAllowed?: boolean | undefined;
    isActive?: boolean | undefined;
}
export interface ClientInfo_HomeGroupInfo {
    isPartOfGroup?: boolean | undefined;
    isGroup?: boolean | undefined;
}
export declare const ClientInfo: MessageFns<ClientInfo>;
export declare const ClientInfo_MainAppWebInfo: MessageFns<ClientInfo_MainAppWebInfo>;
export declare const ClientInfo_NotificationPermissionInfo: MessageFns<ClientInfo_NotificationPermissionInfo>;
export declare const ClientInfo_GLDeviceInfo: MessageFns<ClientInfo_GLDeviceInfo>;
export declare const ClientInfo_SpacecastClientInfo: MessageFns<ClientInfo_SpacecastClientInfo>;
export declare const ClientInfo_SpacecastClientInfo_SpacecastAppliance: MessageFns<ClientInfo_SpacecastClientInfo_SpacecastAppliance>;
export declare const ClientInfo_MobileDataPlanInfo: MessageFns<ClientInfo_MobileDataPlanInfo>;
export declare const ClientInfo_ConfigGroupsClientInfo: MessageFns<ClientInfo_ConfigGroupsClientInfo>;
export declare const ClientInfo_UnpluggedLocationInfo: MessageFns<ClientInfo_UnpluggedLocationInfo>;
export declare const ClientInfo_KidsAppInfo: MessageFns<ClientInfo_KidsAppInfo>;
export declare const ClientInfo_KidsAppInfo_KidsContentSettings: MessageFns<ClientInfo_KidsAppInfo_KidsContentSettings>;
export declare const ClientInfo_KidsAppInfo_KidsCategorySettings: MessageFns<ClientInfo_KidsAppInfo_KidsCategorySettings>;
export declare const ClientInfo_KidsAppInfo_KidsUserEducationSettings: MessageFns<ClientInfo_KidsAppInfo_KidsUserEducationSettings>;
export declare const ClientInfo_MusicAppInfo: MessageFns<ClientInfo_MusicAppInfo>;
export declare const ClientInfo_TvAppInfo: MessageFns<ClientInfo_TvAppInfo>;
export declare const ClientInfo_TvAppInfo_VoiceCapability: MessageFns<ClientInfo_TvAppInfo_VoiceCapability>;
export declare const ClientInfo_UnpluggedAppInfo: MessageFns<ClientInfo_UnpluggedAppInfo>;
export declare const ClientInfo_LocationInfo: MessageFns<ClientInfo_LocationInfo>;
export declare const ClientInfo_LocationInfo_UrlStatus: MessageFns<ClientInfo_LocationInfo_UrlStatus>;
export declare const ClientInfo_HomeGroupInfo: MessageFns<ClientInfo_HomeGroupInfo>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
