import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ) {}
  
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;

    } catch (error) {
      if ( error.code === 11000 ) {
        throw new BadRequestException(`El dato: ${JSON.stringify( error.keyValue )} se encuentra registrado en la base de datos`);
      } else {
        console.log( error );
        throw new InternalServerErrorException("No se pudo crear el pokemon: error interno en el servidor");
      }
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    if ( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    } else if ( isValidObjectId(term) ) {
      pokemon = await this.pokemonModel.findById( term )
    } else {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() })
    }

    if ( !pokemon ) throw new NotFoundException(`Pokemon con el termino: ${term} no fue encontrado`);
    

    return pokemon;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
