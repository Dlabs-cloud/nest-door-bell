import {JwtWebTokenResponse} from "../sdk/auth-api-sdk";

export interface KeyResolver {
    resolve(kid: string): Promise<JwtWebTokenResponse>;
}
