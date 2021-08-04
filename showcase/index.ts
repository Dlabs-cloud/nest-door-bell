import {NestFactory} from "@nestjs/core";
import {ServiceModule} from "./service.module";

async function bootstrap() {
    const app = await NestFactory.create(ServiceModule);
    app.setGlobalPrefix(`api/v1`);

    const port = 8081;
    app.listen(port).then(() => {
        console.log(`Starting application on port ${port}`);
        console.log(`Url:: http://localhost:${port}/api/v1`);
    });
}

bootstrap();
