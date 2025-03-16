# How to Contribute to Harmony

Your contributions are welcome, be it code, documentation or feedback.

If you want to contribute a bigger feature, please open a discussion first to be sure that your idea will be accepted.

## Code Submission

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
If the [provided stubbing helpers](providers/test_stubs.ts) are used, tests try to read the response from the `testdata` directory instead.

When you create a new test which needs data from the network, the missing response has to be cached first.
This happens when you run the new test (let us call it `new.test.ts`) in _download mode_ once.
It is enabled by passing the `--download` flag to the test (note the `--` separator between Deno arguments and arguments for the test itself):

```sh
deno test --allow-net --allow-write new.test.ts -- --download
```

There exists a **provider test framework** with which URL handling and release lookup tests can be described without boilerplate.
This makes provider specifications mostly declarative, the developer only has to write a few assertions for each looked up release.

Often release data is compared against a reference [snapshot] from a `.snap` file in order to catch unexpected changes.
You can create new snapshots or update them by passing the `--update` flag to the test.

[snapshot]: https://jsr.io/@std/testing/doc/snapshot
