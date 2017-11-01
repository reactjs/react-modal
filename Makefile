NODE=$(shell which node)
NPM=$(shell which npm)
YARN=$(shell which yarn)
JQ=$(shell which jq)

BABEL=./node_modules/.bin/babel
COVERALLS=./node_modules/coveralls/bin/coveralls.js
REMOTE="git@github.com:reactjs/react-modal"
CURRENT_VERSION:=$(shell jq ".version" package.json)
COVERAGE?=true

help: info
	@echo
	@echo "Current version: $(CURRENT_VERSION)"
	@echo
	@echo "List of commands:"
	@echo
	@echo "  make info             - display node, npm and yarn versions..."
	@echo "  make deps             - install all dependencies."
	@echo "  make serve            - start the server."
	@echo "  make tests            - run tests."
	@echo "  make tests-single-run - run tests (used by continuous integration)."
	@echo "  make coveralls        - show coveralls."
	@echo "  make lint             - run lint."
	@echo "  make docs             - build and serve the docs."
	@echo "  make build            - build project artifacts."
	@echo "  make publish          - build and publish version on npm."
	@echo "  make publish-docs     - build the docs and publish to gh-pages."
	@echo "  make publish-all      - publish version and docs."

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

tests-single-run:
	@npm run test -- --single-run

coveralls:
	-cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js 2>/dev/null

tests-ci: clean lint
	@COVERAGE=$(COVERAGE) make tests-single-run coveralls

lint:
	@npm run lint

docs: build-docs
	gitbook serve

# Rules for build and publish

check-working-tree:
	@sh ./scripts/repo_status

.version:
	@echo "[Updating react-modal version]"
	@sh ./scripts/version $(CURRENT_VERSION)
	@$(JQ) '.version' package.json | cut -d\" -f2 > .version

.branch:
	@echo "[Release from branch]"
	@git branch | grep '^*' | awk '{ print $$2 }' > .branch
	@echo "Current branch: `cat .branch`"

changelog:
	@echo "[Updating CHANGELOG.md $(CURRENT_VERSION) > `cat .version`]"
	@python3 ./scripts/changelog.py v$(CURRENT_VERSION) v`cat .version` > .changelog_update
	@cat .changelog_update CHANGELOG.md > tmp && mv tmp CHANGELOG.md

compile:
	@echo "[Compiling source]"
	$(BABEL) src --out-dir lib

build: compile
	@echo "[Building dists]"
	@./node_modules/.bin/webpack --config webpack.dist.config.js

release-commit:
	git commit --allow-empty -m "Release v`cat .version`."
	@git add .
	@git commit --amend -m "`git log -1 --format=%s`"

release-tag:
	git tag "v`cat .version`"

publish-version: release-commit release-tag
	@echo "[Publishing]"
	git push $(REMOTE) "`cat .branch`" "v`cat .version`"
	npm publish

pre-publish: clean .branch .version changelog
pre-build: deps-project tests-ci build

publish: check-working-tree pre-publish pre-build publish-version publish-finished

publish-finished: clean

# Rules for documentation

init-docs-repo:
	@mkdir _book

build-docs:
	@echo "[Building documentation]"
	@rm -rf _book
	@gitbook build -g reactjs/react-modal

pre-publish-docs: clean-docs init-docs-repo deps-docs

publish-docs: clean pre-publish-docs build-docs
	@echo "[Publishing docs]"
	@make -C _book -f ../Makefile _publish-docs

_publish-docs:
	git init .
	git commit --allow-empty -m 'update book'
	git checkout -b gh-pages
	touch .nojekyll
	git add .
	git commit -am 'update book'
	git push git@github.com:reactjs/react-modal gh-pages --force

# Run for a full publish

publish-all: publish publish-docs

# Rules for clean up

clean-docs:
	@rm -rf _book

clean-coverage:
	@rm -rf ./coverage/*

clean-build:
	@rm -rf .version .branch lib/*

clean: clean-build clean-docs clean-coverage
