# Harmony

> Music Metadata Aggregator and MusicBrainz Importer

## Features

- Lookup of release metadata from multiple sources by URL and/or GTIN
- Metadata providers convert source data into a common, harmonized representation
- Additional sources can be supported by adding more provider implementations
- Merging of harmonized metadata from your preferred providers
- Seeding of [MusicBrainz] releases using the merged metadata
- Resolving of external entity identifiers to MBIDs
- Automatic guessing of title language and script
- Permalinks which load snapshots of the originally queried source data

## Usage

Most modules of this TypeScript codebase use web standards and should be able to run in modern browsers and other JavaScript runtimes.
Only the [Fresh] server app and the CLI were written specifically for [Deno].

The following instructions assume that you have the latest Deno version installed.

You can start a local development server with the following command:

```sh
deno task dev
```

You can now open the logged URL in your browser to view the landing page.
Try doing some code changes and see how the page automatically reloads.

For a production server you should set the `PORT` environment variable to your preferred port and `DENO_DEPLOYMENT_ID` to the current git revision (commit hash or tag name).
Alternatively you can run the [predefined task](deno.json) which automatically sets `DENO_DEPLOYMENT_ID` and runs `server/main.ts` with all permissions:

```sh
deno task server
```

Other environment variables which are used by the server are documented in the [configuration module](server/config.ts).

There is also a small command line app which can be used for testing:

```sh
deno task cli
```

[Deno]: https://deno.com
[Fresh]: https://fresh.deno.dev
[MusicBrainz]: https://musicbrainz.org

## Architecture

The entire code is written in TypeScript, the components of the web interface additionally use JSX syntax.

A brief explanation of the directory structure should give you a basic idea how Harmony is working:

- `harmonizer/`: Harmonized source data representation and algorithms
  - `types.ts`: Type definitions of harmonized releases (and other entities)
  - `merge.ts`: Merging algorithm for harmonized releases (from multiple sources)
- `providers/`: Metadata provider implementations, one per subfolder
  - `base.ts`: Abstract base classes from which all providers inherit
  - `registry.ts`: Registry which manages all supported providers, instantiated in `mod.ts`
- `lookup.ts`: Combined release lookup which accepts GTIN, URLs and/or IDs for any supported provider from the registry
- `musicbrainz/`: MusicBrainz specific code
  - `seeding.ts`: Release editor seeding
  - `mbid_mapping.ts`: Resolving of external IDs/URLs to MBIDs
- `server/`: Web app to lookup releases and import them into MusicBrainz
  - `routes/`: Request handlers of the [Fresh] server (file-based routing)
  - `static/`: Static files which will be served
  - `components/`: Static [Preact] components which will be rendered as HTML by the server
  - `islands/`: Dynamic [Preact] components which will be re-rendered by the client
- `utils/`: Various utility functions

[Preact]: https://preactjs.com/

## Contributing

Your contributions are welcome, be it code, documentation or feedback.

If you want to contribute a bigger feature, please open a discussion first to be sure that your idea will be accepted.

Before submitting your changes, please make sure that they are properly formatted and pass the linting rules and type checking:

```sh
deno fmt --check
deno lint
deno task check
```

There is also a Deno task which combines the previous commands:

```sh
deno task ok
```
