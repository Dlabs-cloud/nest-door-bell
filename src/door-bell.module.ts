import {DynamicModule, Global, Inject, Module, OnModuleInit} from '@nestjs/common';
import {
    AccessClaimExtractorProvider,
    AccessClaimInterceptorProvider,
    AuthApiKeyResolverProvider,
    AxiosProvider,
    BearerTokenKeyProvider,
    CacheKeyResolverProvider,
    createAuthServiceProvider,
    ExceptionFilters
} from "./providers";
import {AXIOS_PROVIDER} from "./constants";
import {AxiosResponseException} from "./exceptions";
import {AxiosStatic} from 'axios';
import {AuthApiConfig} from "./data/auth-api.config";

@Global()
@Module({
    providers: [
        AxiosProvider,
    ],
})
export class DoorBellModule implements OnModuleInit {
    constructor(@Inject(AXIOS_PROVIDER) private readonly axios: AxiosStatic) {
    }

    public static forRoot(config: AuthApiConfig): DynamicModule {
        const providers = [
            ...createAuthServiceProvider(config),
            AccessClaimExtractorProvider,
            AxiosProvider,
            CacheKeyResolverProvider,
            AuthApiKeyResolverProvider,
            BearerTokenKeyProvider,
            ...ExceptionFilters,
            ...AccessClaimInterceptorProvider,
        ];
        return {
            module: DoorBellModule,
            providers: providers,
            exports: [],
        };
    }

    async onModuleInit() {
        await this.axios.interceptors.response.use(axiosResponse => {
            return axiosResponse;
        }, error => {
            if (error.response.status >= 400 && error.response.status <= 499) {
                throw new AxiosResponseException(error.response.status, error.response.data);
            }
            throw new Error(error);
        });
    }
}
