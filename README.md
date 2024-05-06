# Harmony

> Music Metadata Aggregator and MusicBrainz Importer

## Usage

Most modules of this TypeScript codebase use web standards and should be able to run in modern browsers and other JavaScript runtimes.
Only the [fresh] server app and the CLI were written specifically for [Deno].

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

There is also a small command line app which can be used for testing:

```sh
deno task cli
```

[Deno]: https://deno.com
[fresh]: https://fresh.deno.dev

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
