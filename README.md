# Ike's Games API

Ike's Games is a back-end API for accessing and modifying a database of board-game reviews as well as comments that users can leave on reviews. To find out more, a hosted example version and a JSON containing all the available endpoints can be found at https://ikes-games.cyclic.app/api.

## Project Setup
At a minimum you will need `Node.js` version 19.0.0 and `Postgres` version 14.5. To set up a new project using the API, you will first need to clone this repo...

```
git clone https://github.com/Iketyke/IkesGames.git
```

and install the dependencies listed in `package.json` using `npm install`. This includes: 

- `"dotenv": "^16.0.0",`
- `"express": "^4.18.2",`
- `"pg": "^8.7.3",`
- `"pg-format": "^1.0.4",`
- `"supertest": "^6.3.1"`

Furthermore, two environment files, `.env.development`  and `.env.test` will need to be created with the following lines added to both respectively:

### .env.development
```
PGDATABASE=ikes_games
```
### .env.test
```
PGDATABASE=ikes_games_test
```

If you also want to host your database externally, another environment file is required, `.env.production`. This will allow you to seed to your hosted database:

### .env.production
```
DATABASE_URL=<your database's url here>
```

### Seeding and Testing

Several `npm` scripts are included to allow for seeding and testing:

- `npm run setup-dbs` - creates testing and development databases (`ikes_games` and `ikes_games_test`)

- `npm run seed` - seeds the development database with data found in the development data folder. You can replace this with your own data.

- `test` - runs a set of tests using jest to check the API is functioning correctly.

- `seed-prod` - seeds to an externally hosted database specified in .env.production



