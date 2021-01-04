NODE=$(shell which node 2> /dev/null)
NPM=$(shell which npm 2> /dev/null)
YARN=$(shell which yarn 2> /dev/null)
JQ=$(shell which jq 2> /dev/null)

PKM?=$(if $(YARN),$(YARN),$(shell which npm))

BABEL=./node_modules/.bin/babel
COVERALLS=./node_modules/coveralls/bin/coveralls.js
REMOTE="git@github.com:reactjs/react-modal"
CURRENT_VERSION:=$(shell jq ".version" package.json)
COVERAGE?=true

BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
CURRENT_VERSION:=$(shell jq ".version" package.json)

VERSION:=$(if $(RELEASE),$(shell read -p "Release $(CURRENT_VERSION) -> " V && echo $$V),"HEAD")

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
	@[[ ! -z "$(NODE)" ]] && echo node version: `$(NODE) --version` "$(NODE)"
	@[[ ! -z "$(PKM)" ]] && echo $(shell basename $(PKM)) version: `$(PKM) --version` "$(PKM)"
	@[[ ! -z "$(JQ)" ]] && echo jq version: `$(JQ) --version` "$(JQ)"

deps: deps-project deps-docs

deps-project:
	@$(PKM) install

deps-docs:
	@pip install mkdocs mkdocs-material jsx-lexer

# Rules for development

serve:
	@npm start

tests:
	@npm run test

tests-single-run:
	@npm run test -- --single-run

coveralls:
	-cat ./coverage/lcov.info | $(COVERALLS) 2>/dev/null

tests-ci: clean lint
	@COVERAGE=$(COVERAGE) make tests-single-run coveralls

lint:
	@npm run lint

docs: build-docs
	pygmentize -S default -f html -a .codehilite > docs/pygments.css
	mkdocs serve

# Rules for build and publish

check-working-tree:
	@[ -z "`git status -s`" ] && \
	echo "Stopping publish. There are change to commit or discard." || echo "Worktree is clean."

compile:
	@echo "[Compiling source]"
	$(BABEL) src --out-dir lib

build: compile
	@echo "[Building dists]"
	@npx webpack --config ./scripts/webpack.dist.config.js

pre-release-commit:
	git commit --allow-empty -m "Release v$(VERSION)."

changelog:
	@echo "[Updating CHANGELOG.md $(CURRENT_VERSION) > $(VERSION)]"
	python ./scripts/changelog.py -a $(VERSION) > CHANGELOG.md

update-package-version:
	cat package.json | jq '.version="$(VERSION)"' > tmp; mv -f tmp package.json

release-commit: pre-release-commit update-package-version changelog
	@git add .
	@git commit --amend -m "`git log -1 --format=%s`"

release-tag:
	git tag "v$(VERSION)" -m "`python ./scripts/changelog.py -c $(VERSION)`"

publish-version: release-commit release-tag
	@echo "[Publishing]"
	git push $(REMOTE) "$(BRANCH)" "v$(VERSION)"
	npm publish

pre-publish: clean
pre-build: deps-project tests-single-run build

publish: check-working-tree pre-publish pre-build publish-version publish-finished

publish-finished: clean

# Rules for documentation

init-docs-repo:
	@mkdir _book

build-docs:
	@echo "[Building documentation]"
	@rm -rf _book
	@mkdocs build

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
	@rm -rf lib/*

clean: clean-build clean-docs clean-coverage
