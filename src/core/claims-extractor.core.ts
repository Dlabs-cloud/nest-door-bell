import {jwk2pem, RSA_JWK} from 'pem-jwk';
import {AccessClaims, AccessClaimsExtractor} from "../contracts";
import {JwtWebTokenResponse} from "../sdk/auth-api-sdk";
import {TokenExpiredException} from "../exceptions";
import {decode} from "jsonwebtoken";
import {KeyResolver} from "../key-resolvers/key-resolver";
import {BearerTokenValidator} from "./bearer-token-validator";
import {JwtTokenPayloadDto} from "../data";
import {SimpleAccessClaimsCore} from "./simple-access-claims.core";
import {Inject, Injectable} from "@nestjs/common";
import {CACHE_KEY_RESOLVER} from "../constants";

@Injectable()
export class ClaimsExtractorCore implements AccessClaimsExtractor {

    constructor(@Inject(CACHE_KEY_RESOLVER) private readonly keyResolver: KeyResolver,
                @Inject() private keyValidator: BearerTokenValidator) {
    }

    async getClaims(jws: string): Promise<AccessClaims> {
        if (!jws) {
            return null;
        }

        const decodedToken = decode(jws, {complete: true});
        if (!decodedToken) {
            return null;
        }

        // @ts-ignore
        const header = decodedToken.header;
        if (!header.kid) {
            return null;
        }

        let key: JwtWebTokenResponse = await this.keyResolver.resolve(header.kid);
        const jwk: RSA_JWK = {
            e: key.exponent,
            kty: key.kid,
            n: key.modulus
        }
        let jwtTokenToken: Promise<JwtTokenPayloadDto> = new Promise((resolve, reject) => {
            const pubKey = jwk2pem(jwk);
            return pubKey ? resolve(pubKey) : reject(pubKey);
        }).then(publicKey => {
            return this.keyValidator.verify(jws, publicKey as string)
        }).catch(err => {
            if (err instanceof TokenExpiredException) {
                throw err;
            }
            return null;
        });
        return new SimpleAccessClaimsCore(await jwtTokenToken)


    }
}
