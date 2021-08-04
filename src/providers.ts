import {Configuration} from './sdk/auth-api-sdk';
import {Provider} from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';

import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';
import {
    ACCESS_CLAIMS_EXTRACTOR,
    AUTH_API_KEY_RESOLVER,
    AUTH_SERVICE_OPTIONS,
    AXIOS_PROVIDER,
    CACHE_KEY_RESOLVER
} from "./constants";
import {AxiosResponseExceptionFilter, TokenExpiredExceptionFilter, UnAuthorisedExceptionFilter} from "./filters";
import {AccessClaimInterceptor} from "./interceptors";
import {ClaimsExtractorCore} from "./core/claims-extractor.core";
import {CacheKeyResolver} from "./key-resolvers/impl/cache.key-resolver";
import {AuthApiKeyResolver} from "./key-resolvers/impl/auth-api.key-resolver";
import {KeyResolver} from "./key-resolvers/key-resolver";
import {BearerTokenValidator} from "./core/bearer-token-validator";
import {AuthApiConfig} from "./data/auth-api.config";


export function createAuthServiceProvider(options: AuthApiConfig): Provider[] {
    return [
        {
            provide: AUTH_SERVICE_OPTIONS,
            useFactory: () => {
                return {
                    basePath: options.basePath
                };
            },
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
    useFactory: (keyResolver: KeyResolver, bearerTokenValidator: BearerTokenValidator) => {
        return new ClaimsExtractorCore(keyResolver, bearerTokenValidator);
    },
    inject: [
        CACHE_KEY_RESOLVER,
        BearerTokenValidator
    ],
};


export const AccessClaimInterceptorProvider = [
    AccessClaimInterceptor,
    {
        provide: APP_INTERCEPTOR,
        useExisting: AccessClaimInterceptor,
    },
];


export const CacheKeyResolverProvider = {
    provide: CACHE_KEY_RESOLVER,
    useFactory: (authApiKeyResolver: KeyResolver) => {
        return new CacheKeyResolver(authApiKeyResolver)
    },
    inject: [
        AUTH_API_KEY_RESOLVER
    ]
}

export const AuthApiKeyResolverProvider = {
    provide: AUTH_API_KEY_RESOLVER,
    useFactory: (configuration: Configuration, axios: AxiosInstance) => {
        return new AuthApiKeyResolver(configuration, axios)
    },
    inject: [
        AUTH_SERVICE_OPTIONS,
        AXIOS_PROVIDER
    ]
}

export const BearerTokenKeyProvider = {
    provide: BearerTokenValidator,
    useClass: BearerTokenValidator
}




