import { IsString } from "@nestjs/class-validator";
import { IsNotEmpty } from "class-validator";

export class CreatePostDto {
   @IsString()
   @IsNotEmpty()
   title:string

   @IsString()
   @IsNotEmpty()
   content:string


}
