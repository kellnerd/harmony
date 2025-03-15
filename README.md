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
  - `merge.ts`: Merge algorithm for harmonized releases (from multiple sources)
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

Let us see what happens if someone looks up a release using the website:

1. The Fresh app handles the request to the `/release` route in `server/routes/release.tsx`.
2. A combined release lookup is initiated, which finds the matching provider(s) in the registry and calls their release lookup methods.
3. Each requested provider fetches the release data and converts it into a harmonized release.
4. Once all requested providers have been looked up, the individual release are combined into one release using the merge algorithm.
5. The route handler calls the MBID mapper, handles errors and renders the release page, including a hidden release seeder form.
6. In order to create the release seed, the harmonized release is converted into the format expected by MusicBrainz where some data can only be put into the annotation.

All requests which are initiated by a provider will be cached by the base class using [snap_storage] (persisted in `snaps.db` and a `snaps/` folder).
Each snapshot contains the response body and can be accessed by request URL and a timestamp condition.
This allows edit notes to contain permalinks which encode a timestamp and the necessary info to initiate the same lookup again, now with the underlying requests being cached.

[Preact]: https://preactjs.com/
[snap_storage]: https://github.com/kellnerd/snap_storage

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

## Testing

When you have changed existing code you should run the relevant tests with `deno test`.
Most tests do not require special permissions, only provider tests need read access (`-R`) to testdata and to environment variables (`-E`):

```sh
deno test -RE providers/
```

Automated tests should not perform any **network requests** by default, which means that the affected functions have to be stubbed.
If the [provided stubbing helpers](./providers/test_stubs.ts) are used, tests try to read the response from the `testdata` directory instead.

When you create a new test which needs data from the network, the missing response has to be cached first.
This happens when you run the new test (let us call it `new.test.ts`) in *download mode* once.
It is enabled by passing the `--download` flag to the test (note the `--` separator between Deno arguments and arguments for the test itself):

```sh
deno test --allow-net --allow-write new.test.ts -- --download
```

There exists a **provider test framework** with which URL handling and release lookup tests can be described without boilerplate.
This makes provider specifications mostly declarative, the developer only has to write a few assertions for each looked up release.

Often release data is compared against a reference [snapshot] from a `.snap` file in order to catch unexpected changes.
You can create new snapshots or update them by passing the `--update` flag to the test.

[snapshot]: https://jsr.io/@std/testing/doc/snapshot
