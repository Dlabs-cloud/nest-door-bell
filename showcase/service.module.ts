import {Module} from "@nestjs/common";
import {Configuration, NestDoorBellModule} from "../src";
import {IndexController} from "./index.controller";

const configuration: Configuration = {
    accessToken: undefined,
    apiKey: undefined,
    baseOptions: undefined,
    basePath: "http://localhost:3000/api/v1",
    formDataCtor: undefined,
    password: "",
    username: "",
    isJsonMime(mime: string): boolean {
        return false;
    }

}

@Module({
    imports: [
        NestDoorBellModule.forRoot({basePath: "http://localhost:3000/api/v1"})
    ],
    controllers: [
        IndexController
    ]
})
export class ServiceModule {

}
