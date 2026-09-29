.PHONY: test publication

test:
	npm run check
	python3 -m pytest tests/publication/test_readme.py -q

publication:
	python3 -m pytest tests/publication/test_readme.py -q
