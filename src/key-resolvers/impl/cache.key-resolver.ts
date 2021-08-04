import {KeyResolver} from "../key-resolver";
import {JwtWebTokenResponse} from "../../sdk/auth-api-sdk";

export class CacheKeyResolver implements KeyResolver {
    private cache: {
        kid: string,
        key: JwtWebTokenResponse
    }[] = [];

    private cacheSize = 10

    constructor(private readonly keyResolver: KeyResolver, config?: { cacheSize: number }) {
        if (config?.cacheSize) this.cacheSize = config.cacheSize;
    }


    resolve(kid: string): Promise<JwtWebTokenResponse> {
        let matchedValue = this.cache.filter(cacheValue => cacheValue.kid === kid);
        if (matchedValue.length) return Promise.resolve(matchedValue[0].key);
        return this.keyResolver.resolve(kid).then((key: JwtWebTokenResponse) => {
            if (this.cache.length >= this.cacheSize) {
                this.cache.slice(0, this.cacheSize - 1);
            }
            this.cache.unshift({kid, key});
            return key;
        })
    }

}
