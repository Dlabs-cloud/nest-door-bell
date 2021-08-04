import {KeyResolver} from "../key-resolver";
import {Configuration, JwtWebTokenResponse, SignatureKeyControllerApi} from "../../sdk/auth-api-sdk";
import {AxiosInstance} from "axios";


export class AuthApiKeyResolver implements KeyResolver {
    private signatureKeyControllerApi: SignatureKeyControllerApi;

    constructor(private readonly conf: Configuration, axios: AxiosInstance) {
        this.signatureKeyControllerApi = new SignatureKeyControllerApi(conf, conf.basePath, axios);
    }

    resolve(kid: string): Promise<JwtWebTokenResponse> {
        return this.signatureKeyControllerApi.getJsonWebKey({kid})
            .then(response => {
                return Promise.resolve(response.data.data);
            });
    }

}
