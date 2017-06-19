# Development

`react-modal` uses `make` to build and publish new versions and documentation.

It works as a checklist for the future releases to keep everything updated such as
`CHANGELOG.md`, `package.json` and `bower.json` and so on.

The minimun works as a normal `npm script`.

## Usage

Once you clone `react-modal`, you can run `sh bootstrap.sh` to check
and download dependencies not managed by `react-modal` such as `gitbook-cli`.

It will also show information about the current versions of `node`, `npm`,
`yarn` and `jq` available.

## List of `npm` commands:

    $ npm start -s or yarn start  # to run examples
    $ npm run tests
    $ npm run lint

## List of `make` commands:

    $ make help           # show all make commands available
    $ make deps           # npm install, gitbook plugins...
    $ make serve          # to run examples
    $ make tests          # use when developing
    $ make tests-ci       # single run
    $ make lint           # pass lint
    $ make publish        # execute the entire pipeline to publish
    $ make publish-docs   # execute the pipeline for docs
