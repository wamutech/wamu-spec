# Wamu

This repository contains the source for the [whitepaper](/papers/whitepaper.md), [technical specification](/papers/specification.md) and website ([pages](/src/pages), [docs](/docs) and [blog](/blog)) for the [Wamu](https://wamu.tech) project.

### Installation

```shell
yarn
```

### Local Development

```shell
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```shell
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

This repo is configured to deploy to GitHub pages via a [GitHub actions workflow definition](/.github/workflows/pages.yml).

## License

The [whitepaper](/static/whitepaper.pdf), [technical specification](/static/specification.pdf) and website content are licensed under [CC-BY-SA-4.0](/LICENSE-CC). 

The source code is licensed under [GPL-3.0](/LICENSE-GPL).

## Acknowledgements

🌱 Funded by: the [Ethereum Foundation](https://esp.ethereum.foundation/).
