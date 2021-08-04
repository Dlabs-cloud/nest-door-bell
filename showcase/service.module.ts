import {Module} from "@nestjs/common";
import {Configuration, DoorBellModule} from "../src";
import {IndexController} from "./index.controller";


@Module({
    imports: [
        DoorBellModule.forRoot({basePath: "http://localhost:3000/api/v1"})
    ],
    controllers: [
        IndexController
    ]
})
export class ServiceModule {

}
