NODE=$(shell which node)
NPM=$(shell which npm)
YARN=$(shell which yarn)
JQ=$(shell which jq)

VERSION=$(shell jq ".version" package.json)

help: info
	@echo
	@echo "List of commands:"
	@echo
	@echo "  make info         - display node, npm and yarn versions..."
	@echo "  make deps         - install all dependencies."
	@echo "  make serve        - start the server."
	@echo "  make tests        - run tests."
	@echo "  make docs         - build and serve the docs."
	@echo "  make build        - build project artifacts."
	@echo "  make publish      - build and publish version on npm."
	@echo "  make publish-docs - build the docs and publish to gh-pages."
	@echo "  make publish-all  - publish version and docs."

info:
	@echo node version: `$(NODE) --version` "($(NODE))"
	@echo npm version: `$(NPM) --version` "($(NPM))"
	@echo yarn version: `$(YARN) --version` "($(YARN))"
	@echo jq version: `$(JQ) --version` "($(JQ))"
	@echo react-modal version: $(VERSION)

deps: deps-project deps-docs

deps-project:
	@[[ ! -z "$(YARN)" ]] && $(YARN) install || $(NPM) install

deps-docs:
	@gitbook install

# Rules for development

serve:
	@npm start

tests:
	@npm run test

tests-ci:
	@npm run test -- --single-run

docs: build-docs
	gitbook serve

# Rules for build and publish

build:
	@echo "[Building dists]"
	@./node_modules/.bin/webpack --config webpack.dist.config.js

build-docs:
	@echo "[Building documentation]"
	@rm -rf _book
	@gitbook build -g reactjs/react-modal

version:
	@echo "[Updating react-modal version]"
	@sh ./scripts/version $(VERSION)

release-commit:
	@$(JQ) '.version' package.json | cut -d\" -f2 > .version
	git commit --allow-empty -m "Release v`cat .version`."
	@rm .version
	git add .
	git commit --amend -m "`git log -1 --format=%s`"

release-tag:
	@$(JQ) '.version' package.json | cut -d\" -f2 > .version
	git tag "v`cat .version`"
	@rm .version

publish-version: release-commit release-tag
	@echo "[Publishing]"
	@$(JQ) '.version' package.json | cut -d\" -f2 > .version
	git push git@github.com:reactjs/react-modal "`git branch | grep '^*' | awk '{ print $$2 }'`" "v`cat .version`"
	npm publish
	@rm .version

publish: version deps-project build publish-version publish-finished

publish-docs: deps-docs build-docs
	@echo "[Publishing docs]"
	git init _book
	cd _book
	git commit --allow-empty -m 'update book'
	git checkout -b gh-pages
	touch .nojekyll
	git add .
	git commit -am 'update book'
	git push git@github.com:reactjs/react-modal gh-pages --force
	cd ..

publish-all: publish publish-docs
