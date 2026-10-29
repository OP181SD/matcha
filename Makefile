DC := docker compose -f docker-compose.yml

.DEFAULT_GOAL := up
.PHONY: up build down restart re clean logs test

up:
	$(DC) up -d --build

build:
	$(DC) build

down:
	$(DC) down

restart:
	$(DC) restart

re: clean up

clean:
	$(DC) down -v --remove-orphans

logs:
	$(DC) logs -f

test:
	$(DC) --profile test run --rm test
