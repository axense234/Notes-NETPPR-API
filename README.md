# Very Cool Notes - MERN WITH TS AND SASS - BACKEND

The backend project using Node, Express, Typescript, Postgresql, Prisma, Redis made for my Very Cool Notes project.
website.I wanted to play around with all those technologies together and give myself a challenge(that kinda backfired).

## Description

The backend project using Node, Express, Typescript, Postgresql, Prisma, Redis made for my Very Cool Notes project.
website.I wanted to play around with all those technologies together and give myself a challenge(that kinda backfired).
Test it out yourself since at the time of writing this i do not know what i did here.

## Getting Started

### Dependencies

- check package.json for details
- also check out the [frontend](https://github.com/axense234/Very-Cool-Notes)
- if are on windows you will need WSL(windows subsystem for linux) installed because you will need to start up a redis server on such terminal([click here for tutorial](https://learn.microsoft.com/en-us/windows/wsl/install))

### Installing

```
git clone https://github.com/axense234/Notes-NETPPR-API
cd Notes-NETPPR-API
npm install
```

### Executing program

1. Create a .env file in the root directory

2. Add the following variables:

- DATABASE_URL (the connection string of the db you want to connect to, preferably postgresql)

- REDIS_INSTANCE_URL (optional since you can just start up a local redis server)

- JWT_SECRET_KEY (your jwt secret key)

3. Open up WSL cmd and run the following

```
redis-server
```

4. Run the backend locally

```
npm test
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
