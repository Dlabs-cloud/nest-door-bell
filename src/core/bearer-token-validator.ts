import {TokenExpiredError, verify, VerifyErrors} from "jsonwebtoken";
import {JwtTokenPayloadDto} from "../data";
import {TokenExpiredException} from "../exceptions";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BearerTokenValidator {


    public async verify(jws: string, publicKey: string): Promise<JwtTokenPayloadDto> {

        try {
            let claim = await this.verifyToken(jws, publicKey);
            return Promise.resolve(claim as JwtTokenPayloadDto);
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                throw new TokenExpiredException();
            }
            return null;
        }
    }

    private verifyToken(jws: string, publicKey: string): Promise<unknown> {
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
                    resolve(decoded as JwtTokenPayloadDto);
                }
                reject(null);
            });
        });
    }
}
