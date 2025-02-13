import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Nest Auth Doc')
    .setDescription('Auth Module')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


// მოგესალმებით თქვენი დავალება შემდეგია 26 დავალებას დაუამტოთ:
// 1) უნდა დააიმპლემენტიროდ aws s3 bucket ის მოდული თქვენს აპლიკაციაში
// 2) იუზერს უნდა შეეძლოს შექმნის დროს გამოატანოს პროფილის ფოტო და ბაზაში ჩასეტეთ პროფილის ფოტოზე s3-დან დაბრუნებული file-id
// 3) იუზერის getById ს დროს ეს ფოტო უნდა გადააქციოთ base64 ფორმატსი და ისე დაუბრუნოთ კლიენტს
// 4) იუზერს უნდა შეეძლოს პროფილის ფოტოს წაშლა, file-id ის მიხედვით.
// რესურსები: https://github.com/Datodia/aws-s3
// https://stackoverflow.com/questions/63872093/accept-form-data-in-nest-js
