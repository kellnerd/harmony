import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface UserInfo {
    onBehalfOfUser?: string | undefined;
    enableSafetyMode?: boolean | undefined;
    credentialTransferTokens: UserInfo_CredentialTransferToken[];
    delegatePurchases?: UserInfo_DelegatePurchases | undefined;
    kidsParent?: UserInfo_KidsParent | undefined;
    isIncognito?: boolean | undefined;
    lockedSafetyMode?: boolean | undefined;
    delegationContext?: UserInfo_DelegationContext | undefined;
    serializedDelegationContext?: string | undefined;
}
export interface UserInfo_KidsParent {
}
export interface UserInfo_DelegatePurchases {
}
export interface UserInfo_DelegationContext {
}
export interface UserInfo_CredentialTransferToken {
}
export declare const UserInfo: MessageFns<UserInfo>;
export declare const UserInfo_KidsParent: MessageFns<UserInfo_KidsParent>;
export declare const UserInfo_DelegatePurchases: MessageFns<UserInfo_DelegatePurchases>;
export declare const UserInfo_DelegationContext: MessageFns<UserInfo_DelegationContext>;
export declare const UserInfo_CredentialTransferToken: MessageFns<UserInfo_CredentialTransferToken>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
