# Very Cool Notes - MERN WITH TS AND SASS - BACKEND

The backend project using Node, Express, Typescript, Postgresql, Prisma, Redis made for my Very Cool Notes project.
website.I wanted to play around with all those technologies together and give myself a challenge(that kinda backfired).

## Description

The backend project using Node, Express, Typescript, Postgresql, Prisma, Redis made for my Very Cool Notes project.
website.I wanted to play around with all those technologies together and give myself a challenge(that kinda backfired).
Test it out yourself since at the time of writing this i do not know what i did here.

## Getting Started

### Dependencies

- Git installed on your machine
- Docker installed on your machine(optional)
- Your own Postgres DB(optional if you test using docker-compose)
- Your own Redis DB(optional if you test using docker-compose)
- Check package.json for other dependencies

### Installing

- Install using Git

```
git clone https://github.com/axense234/Notes-NETPPR-API
cd Notes-NETPPR-API
npm install
```

- rename **.env.sample** to **.env** and put your own environment variables respectively:
  - **PGHOST** = the host of your postgres db
  - **PGDATABASE** = the database of your postgres db
  - **PGUSERNAME** = the username of your postgres db
  - **PGPASSWORD** = the password of your postgres db user
  - **PGPORT** = the port of your postgres db
  - **REDIS_HOST** = the host of your redis db
  - **REDIS_PASSWORD** = the password of your redis db
  - **REDIS_PORT** = the port of your redis db
  - **PORT** = the port which the server listens on
  - **JWT_SECRET_KEY** = the jwt secret used for authorization purposes
  - **ADMINER_PORT** = _OPTIONAL_ the port where you want adminer to listen on
  - **REDIS_COMMANDER_PORT** = _OPTIONAL_ the port where you want redis-commander to listen on
  - **DATABASE_URL** = the connection string of your postgres db(made up of other env variables)
  - **REDIS_INSTANCE_URL** = the connection string of your redis db(made up of other env variables)

### Executing program

- Test through nodemon

```
npm test
```

- Test through docker-compose

```
docker build -t notes-netppr-api .
docker compose up
```

## Authors

- axense234

## Version History

- 1.0.0
  - Changed some things a bit and added a README.md
  - See [commit change](https://github.com/axense234/Notes-NETPPR-API/commits/master) or See [release history](https://github.com/axense234/Notes-NETPPR-API/releases)
- 0.1
  - Initial Release(no README.md)

## License

This project is licensed under the GNU License - see the LICENSE.md file for details

## Acknowledgments

- just wanted to test out my backend skills with node express ts postgresql prisma redis
