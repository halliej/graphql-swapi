const Schema = require('graph.ql');
const axios = require('axios');

module.exports = (loader) => {
  return Schema(`

    scalar Date

    type Character {
      name: String!
      eye_color: String
      gender: String
      homeworld(): Planet
      films(): [Film]
    }

    type Planet {
      name: String!
      population: Int
    }

    type Film {
      title: String!
      producers(): [String]
      characters(limit: Int): [Character]
      release_date: Date
    }

  # These are the available queries on this server
    type Query {
      # Find a film by id
      find_film (id: Int): Film
      # Find a character by id
      find_character (id: Int): Character
    }
  `, {
    Date: {
      serialize: (v) => {
        return new Date(v);
      }
    },
    Character: {
      homeworld (character, args) {
        return loader.planet.load(character.homeworld);
      },
      films (character, args) {
        return loader.film.loadMany(character.films);
      }
    },
    Film: {
      producers (film, args) {
        return film.producer.split(/\s*,\s*/);
      },
      characters (film, args) {
        var characters = args.limit ? film.characters.slice(0, args.limit) : film.characters;
        return loader.character.loadMany(characters);
      }
    },
    Query: {
      find_film (query, args) {
        return loader.film.load(args.id);
      },
      find_character (query, args) {
        return loader.character.load(args.id);
      }
    }
  });
};
