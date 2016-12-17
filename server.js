const express = require('express');
const graphql = require('express-graphiql');
const app = express();
const Schema = require('./main');
const loader = require('./loader');

app.use((req, res, next) =>  {
  req.loader = loader();
  next();
});

app.post('/query', graphql(Schema));

app.get('/', (req, res) => {
  let film = req.query.film;
  console.time('with data loader');
  Schema(req.loader)(`
    query find ($film: Int!) {
      find_film (id: $film) {
        title
        release_date
        characters (limit: 3) {
          name
          eye_color
          homeworld {
            name
            population
          }
          films {
            title
          }
        }
      }
    }
  `, {
    film: film
  }).then((result) => {
    console.timeEnd('with data loader');
    res.send(result);
  });
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
