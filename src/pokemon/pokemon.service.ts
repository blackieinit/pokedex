import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(

    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService

  ) {
    this.defaultLimit = configService.getOrThrow('defaultLimit');
  }
  
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;

    } catch (error) {
      this.handleExceptions( error )
    }
  }

  async findAll( paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return await this.pokemonModel.find()
    .limit( limit )
    .skip( offset )
    .sort({
      no: 1
    })
    .select('-__v');
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

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne( term );

      if ( updatePokemonDto.name ) 
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()

      await pokemon.updateOne( updatePokemonDto );
      
      return {...pokemon.toJSON(), ...updatePokemonDto};

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    try {
      const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

      if ( deletedCount === 0 ) 
        throw new BadRequestException(`Pokemon with id "${ id }" not found`);

    } catch ( error ) {
      throw new BadRequestException(`Error interno: ${error}`);
    }
  }

  private handleExceptions( error:any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`El dato: ${JSON.stringify( error.keyValue )} se encuentra registrado en la base de datos`);
    } else {
      console.log( error );
      throw new InternalServerErrorException("No se pudo modificar el pokemon: error interno en el servidor");
    }
  }
}
