import {Controller, Get} from "@nestjs/common";
import {AnonymousUser} from "../src";

@Controller("show-case")
export class IndexController {

    @Get()
    index() {
        return "Testing Auth Showcase"
    }


    @AnonymousUser()
    @Get('health')
    health() {
        return "Up and running"
    }
}
