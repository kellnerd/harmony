# Harmony

> Music Metadata Aggregator and MusicBrainz Importer

## Usage

Most modules of this TypeScript codebase use web standards and should be able to run in modern browsers and other JavaScript runtimes.
Only the [fresh] server app and the CLI were written specifically for [Deno].

The following instructions assume that you have Deno 1.33 or later installed.

You can start a local development server with the following command:

```sh
deno task dev
```

You can now open http://localhost:8000 in your browser to view the landing page.
Try doing some code changes and see how the page automatically reloads.

For a production server you should set the `PORT` environment variable to your preferred port and `DENO_DEPLOYMENT_ID` to the current git revision.
Alternatively you can run the [predefined task](deno.json) which automatically sets `DENO_DEPLOYMENT_ID` and runs `src/server/main.ts` with all permissions:

```sh
deno task server
```

There is also a small command line app which can be used for testing:

```sh
deno task cli
```

[Deno]: https://deno.com/runtime
[fresh]: https://fresh.deno.dev/
