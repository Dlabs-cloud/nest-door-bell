import {jwk2pem, RSA_JWK} from 'pem-jwk';
import {AccessClaims, AccessClaimsExtractor} from "../contracts";
import {DefaultApi} from "../auth-api-sdk";
import {SimpleAccessClaimsCore} from "./simple-access-claims.core";
import {TokenExpiredException} from "../exceptions";
import {decode, TokenExpiredError, verify, VerifyErrors} from "jsonwebtoken";
import {JwtTokenPayloadDto} from "../data";

export class ClaimsExtractorCore implements AccessClaimsExtractor {

    private kidPair: Map<string, string> = new Map<string, string>();

    constructor(private readonly authService: DefaultApi) {
    }

    async getClaims(jws: string): Promise<AccessClaims> {
        if (!jws) {
            return null;
        }

        try {
            const decodedToken = decode(jws, {complete: true});
            if (!decodedToken) {
                return null;
            }

            // @ts-ignore
            const header = decodedToken.header;
            if (!header.kid) {
                return null;
            }


            if (this.kidPair.has(header.kid)) {
                const publicKey = this.kidPair.get(header.kid);
                const claims = await this.verifyToken(jws, publicKey);
                return new SimpleAccessClaimsCore(claims as JwtTokenPayloadDto);
            }
            const publicKey = await this
                .authService
                .signatureKeyControllerGetJsonWebKey(header.kid)
                .then(tokenResponse => {
                    const response = tokenResponse.data;
                    const jwk: RSA_JWK = {
                        e: response.exponent,
                        kty: response.kty,
                        n: response.modulus,

                    };
                    return jwk2pem(jwk);
                });

            if (publicKey) {
                this.kidPair.set(header.kid, publicKey);
                const claims = await this.verifyToken(jws, publicKey);
                return new SimpleAccessClaimsCore(claims as JwtTokenPayloadDto);
            }
            return null;

        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new TokenExpiredException();
            }
            return null;
        }

    }

    private verifyToken(jws: string, publicKey: string) {
        return new Promise((resolve, reject) => {
            verify(jws, publicKey, (err: VerifyErrors, decoded: object | string) => {
                if (err) {
                    if (err instanceof SyntaxError) {
                        reject('Token is invalid');
                    } else {
                        reject(err);
                    }
                }
                if (decoded) {
                    resolve(decoded);
                }
                reject(null);
            });
        });
    }

}