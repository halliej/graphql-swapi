let Dataloader = require('dataloader');
const axios = require('axios');

module.exports = () => {
  return {
    film: Film(),
    character: Character(),
    planet: Planet()
  };
};

function Film () {
  return new Dataloader(ids => {
    return axios.all(ids.map(id => {
      let url = Number.isInteger(id) ? `http://swapi.co/api/films/${id}/` : id;
      return axios.get(url).then(res => res.data);
    }));
  });
}

function Character () {
  return new Dataloader(ids => {
    return axios.all(ids.map(id => {
      let url = Number.isInteger(id) ? `http://swapi.co/api/people/${id}/` : id;
      return axios.get(url).then(res => res.data);
    }));
  });
}

function Planet () {
  return new Dataloader(ids => {
    return axios.all(ids.map(id => {
      let url = Number.isInteger(id) ? `http://swapi.co/api/planets/${id}/` : id;
      return axios.get(url).then(res => res.data);
    }));
  });
}

// let film = Film();
// film.loadMany([1,'http://swapi.co/api/films/3/'])
// film.load(1)
  //  .then(data => console.log(data));

// let character = Character();
// character.loadMany([1,2])
//   .then(data => console.log(data));

  // let planet = Planet();
  // planet.loadMany([1,2])
  //   .then(data => console.log(data));
