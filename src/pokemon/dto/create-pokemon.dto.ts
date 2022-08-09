import { IsNumber, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsNumber()
    @IsPositive({message: "El número del pokemon debe ser un número positivo"})
    @Min(1)
    no: number;

    @IsString({message: "El nombre del pokemon debe ser un string"})
    @MinLength(1, {message: "El nombre del pokemon debe ser mayor a 1 caracter"})
    name: string;
}
