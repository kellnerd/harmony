import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { InnerTubeContext } from "./innertube_context.js";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface MetadataUpdateRequest {
    context?: InnerTubeContext | undefined;
    encryptedVideoId?: string | undefined;
    title?: MetadataUpdateRequest_MdeTitleUpdateRequest | undefined;
    description?: MetadataUpdateRequest_MdeDescriptionUpdateRequest | undefined;
    privacy?: MetadataUpdateRequest_MdePrivacyUpdateRequest | undefined;
    tags?: MetadataUpdateRequest_MdeTagsUpdateRequest | undefined;
    category?: MetadataUpdateRequest_MdeCategoryUpdateRequest | undefined;
    license?: MetadataUpdateRequest_MdeLicenseUpdateRequest | undefined;
    ageRestriction?: MetadataUpdateRequest_MdeAgeRestrictionUpdateRequest | undefined;
    videoStill?: MetadataUpdateRequest_MdeVideoStillRequestParams | undefined;
    madeForKids?: MetadataUpdateRequest_MdeMadeForKidsUpdateRequestParams | undefined;
    racy?: MetadataUpdateRequest_MdeRacyRequestParams | undefined;
}
export interface MetadataUpdateRequest_MdeTitleUpdateRequest {
    newTitle?: string | undefined;
}
export interface MetadataUpdateRequest_MdeDescriptionUpdateRequest {
    newDescription?: string | undefined;
}
export interface MetadataUpdateRequest_MdePrivacyUpdateRequest {
    newPrivacy?: number | undefined;
    clearPrivacyDraft?: boolean | undefined;
}
export interface MetadataUpdateRequest_MdeTagsUpdateRequest {
    newTags: string[];
}
export interface MetadataUpdateRequest_MdeCategoryUpdateRequest {
    newCategoryId?: number | undefined;
}
export interface MetadataUpdateRequest_MdeLicenseUpdateRequest {
    newLicenseId?: string | undefined;
}
export interface MetadataUpdateRequest_MdeMadeForKidsUpdateRequestParams {
    operation?: number | undefined;
    newMfk?: number | undefined;
}
export interface MetadataUpdateRequest_MdeRacyRequestParams {
    operation?: number | undefined;
    newRacy?: number | undefined;
}
export interface MetadataUpdateRequest_MdeAgeRestrictionUpdateRequest {
    newIsAgeRestricted?: boolean | undefined;
}
export interface MetadataUpdateRequest_MdeVideoStillRequestParams {
    operation?: number | undefined;
    newStillId?: number | undefined;
    image?: MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage | undefined;
    testImage?: MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage | undefined;
    experimentImage: MetadataUpdateRequest_MdeVideoStillRequestParams_ThumbnailExperimentImageData[];
}
export interface MetadataUpdateRequest_MdeVideoStillRequestParams_ThumbnailExperimentImageData {
    image?: MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage | undefined;
}
export interface MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage {
    rawBytes?: Uint8Array | undefined;
    dataUri?: string | undefined;
    frameTimestampUs?: number | undefined;
    isVertical?: boolean | undefined;
}
export declare const MetadataUpdateRequest: MessageFns<MetadataUpdateRequest>;
export declare const MetadataUpdateRequest_MdeTitleUpdateRequest: MessageFns<MetadataUpdateRequest_MdeTitleUpdateRequest>;
export declare const MetadataUpdateRequest_MdeDescriptionUpdateRequest: MessageFns<MetadataUpdateRequest_MdeDescriptionUpdateRequest>;
export declare const MetadataUpdateRequest_MdePrivacyUpdateRequest: MessageFns<MetadataUpdateRequest_MdePrivacyUpdateRequest>;
export declare const MetadataUpdateRequest_MdeTagsUpdateRequest: MessageFns<MetadataUpdateRequest_MdeTagsUpdateRequest>;
export declare const MetadataUpdateRequest_MdeCategoryUpdateRequest: MessageFns<MetadataUpdateRequest_MdeCategoryUpdateRequest>;
export declare const MetadataUpdateRequest_MdeLicenseUpdateRequest: MessageFns<MetadataUpdateRequest_MdeLicenseUpdateRequest>;
export declare const MetadataUpdateRequest_MdeMadeForKidsUpdateRequestParams: MessageFns<MetadataUpdateRequest_MdeMadeForKidsUpdateRequestParams>;
export declare const MetadataUpdateRequest_MdeRacyRequestParams: MessageFns<MetadataUpdateRequest_MdeRacyRequestParams>;
export declare const MetadataUpdateRequest_MdeAgeRestrictionUpdateRequest: MessageFns<MetadataUpdateRequest_MdeAgeRestrictionUpdateRequest>;
export declare const MetadataUpdateRequest_MdeVideoStillRequestParams: MessageFns<MetadataUpdateRequest_MdeVideoStillRequestParams>;
export declare const MetadataUpdateRequest_MdeVideoStillRequestParams_ThumbnailExperimentImageData: MessageFns<MetadataUpdateRequest_MdeVideoStillRequestParams_ThumbnailExperimentImageData>;
export declare const MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage: MessageFns<MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
