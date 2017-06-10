NODE=$(shell which node)
NPM=$(shell which npm)
YARN=$(shell which yarn)
JQ=$(shell which jq)

REMOTE="git@github.com:reactjs/react-modal"

VERSION=$(shell jq ".version" package.json)

help: info
	@echo
	@echo "Current version: $(VERSION)"
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

.version:
	@echo "[Updating react-modal version]"
	@sh ./scripts/version $(VERSION)
	@$(JQ) '.version' package.json | cut -d\" -f2 > .version

.branch:
	@echo "[Release from branch]"
	@git branch | grep '^*' | awk '{ print $$2 }' > .branch
	@echo "Current branch: `cat .branch`"

release-commit:
	git commit --allow-empty -m "Release v`cat .version`."
	git add .
	git commit --amend -m "`git log -1 --format=%s`"

release-tag:
	git tag "v`cat .version`"

publish-version: release-commit release-tag
	@echo "[Publishing]"
	git push $(REMOTE) "`cat .branch`" "v`cat .version`"
	npm publish

publish-finished: clean

clean:
	@rm -rf .version .branch

pre-publish: clean .branch .version deps-project tests-ci build

publish: pre-publish publish-version publish-finished

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
