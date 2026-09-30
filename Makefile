.PHONY: test publication

test:
	npm run check
	python3 -m pytest tests/publication -q

publication:
	python3 -m pytest tests/publication -q
