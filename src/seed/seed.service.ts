import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance

  async executeSeed() {
    const { data } = await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=5')

    data.results.forEach(({ name, url }) => {
      const segments:String[] = url.split('/');
      const no:number = +segments[ segments.length - 2 ];

      console.log({name, no})
    })

    return data.results;
  }
}
