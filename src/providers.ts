import {Configuration, DefaultApi} from './auth-api-sdk';
import {Provider} from '@nestjs/common';
import axios, {AxiosStatic} from 'axios';

import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';
import {ACCESS_CLAIMS_EXTRACTOR, AUTH_SERVICE_OPTIONS, AXIOS_PROVIDER, TSS_AUTH_API} from "./constants";
import {AxiosResponseExceptionFilter, TokenExpiredExceptionFilter, UnAuthorisedExceptionFilter} from "./filters";
import {AccessClaimInterceptor} from "./interceptors";
import {ClaimsExtractorCore} from "./core/claims-extractor.core";


export function createAuthServiceProvider(options: Configuration): Provider[] {
    return [
        {
            provide: AUTH_SERVICE_OPTIONS,
            useValue: options,
        },
    ];
}

export const ExceptionFilters = [
    {
        provide: APP_FILTER,
        useClass: AxiosResponseExceptionFilter,
    },
    {
        provide: APP_FILTER,
        useClass: TokenExpiredExceptionFilter,
    },
    {
        provide: APP_FILTER,
        useClass: UnAuthorisedExceptionFilter,
    },
];


export const AxiosProvider = {
    provide: AXIOS_PROVIDER,
    useFactory: () => {
        return axios;
    },
};

export const AccessClaimExtractorProvider = {
    provide: ACCESS_CLAIMS_EXTRACTOR,
    useFactory: (authService: DefaultApi) => {
        return new ClaimsExtractorCore(authService);
    },
    inject: [
        TSS_AUTH_API,
    ],
};


export const AccessClaimInterceptorProvider = [
    AccessClaimInterceptor,
    {
        provide: APP_INTERCEPTOR,
        useExisting: AccessClaimInterceptor,
    },
];

export const ApiSdkProvider = {
    provide: TSS_AUTH_API,
    useFactory: (options: Configuration, axios: AxiosStatic) => {
        return new DefaultApi(options, options.basePath, axios);
    },
    inject: [
        AUTH_SERVICE_OPTIONS,
        AXIOS_PROVIDER,
    ],
};