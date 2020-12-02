import {Configuration} from './auth-api-sdk';
import {DynamicModule, Global, Inject, Module, OnModuleInit} from '@nestjs/common';
import {
    AccessClaimExtractorProvider, AccessClaimInterceptorProvider,
    ApiSdkProvider,
    AxiosProvider,
    createAuthServiceProvider,
    ExceptionFilters
} from "./providers";
import {AXIOS_PROVIDER} from "./constants";
import {AxiosResponseException} from "./exceptions";
import {AxiosStatic} from 'axios';

@Global()
@Module({
    providers: [
        AxiosProvider,
    ],
})
export class TssAuthServiceModule implements OnModuleInit {
    constructor(@Inject(AXIOS_PROVIDER) private readonly axios: AxiosStatic) {
    }

    public static forRoot(config: Configuration): DynamicModule {
        const providers = [
            ...createAuthServiceProvider(config),
            AccessClaimExtractorProvider,
            ApiSdkProvider,
            AxiosProvider,
            ...ExceptionFilters,
            ...AccessClaimInterceptorProvider,
        ];
        return {
            module: TssAuthServiceModule,
            providers: providers,
            exports: [
                ApiSdkProvider,
            ],
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