import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    try {

      await this.pokemonModel.deleteMany();

      const { data } = await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

      const pokemonInsert: { name:string, no:number }[] = [];

      data.results.forEach(async ({ name, url }) => {
        const segments:String[] = url.split('/');
        const no:number = +segments[ segments.length - 2 ];
  
        pokemonInsert.push({ name, no });

      });

      await this.pokemonModel.insertMany(pokemonInsert);
  
      return "Seed execute successfully";
    } catch ( error ) {
      return error;
    }
  }
}
