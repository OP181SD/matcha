.DEFAULT_GOAL := man

COMPOSE_FILE := docker-compose.yml
DOCKER_COMPOSE := docker-compose -f $(COMPOSE_FILE)

.PHONY: help build up down restart logs \
        frontend-up frontend-down frontend-restart frontend-logs \
        nginx-up nginx-down nginx-restart nginx-logs \
        backend-up backend-down backend-restart backend-logs \
        adminer-up adminer-down adminer-restart adminer-logs \
        database-up database-down database-restart database-logs \
        build-frontend build-nginx build-backend build-database \
        clean prune re du clean-node-modules

man:
	@echo "Commandes disponibles :"
	@echo ""
	@echo "Commandes générales :"
	@echo "  make build             Construire toutes les images Docker"
	@echo "  make up                Démarrer tous les services"
	@echo "  make down              Arrêter et supprimer tous les services"
	@echo "  make restart           Redémarrer tous les services"
	@echo "  make logs              Afficher les logs de tous les services"
	@echo "  make clean             Arrêter et supprimer tous les services et volumes"
	@echo "  make prune             Nettoyer l'environnement Docker (ATTENTION : suppression globale)"
	@echo "  make re                Nettoyer et reconstruire l'environnement Docker"
	@echo "  make du                Recréer l'environnement Docker (down up build)"
	@echo ""
	@echo "Service Frontend :"
	@echo "  make frontend-up       Démarrer le service frontend"
	@echo "  make frontend-down     Arrêter le service frontend"
	@echo "  make frontend-restart  Redémarrer le service frontend"
	@echo "  make frontend-logs     Afficher les logs du service frontend"
	@echo "  make build-frontend    Construire l'image du frontend"
	@echo ""
	@echo "Service Nginx :"
	@echo "  make nginx-up          Démarrer le service nginx"
	@echo "  make nginx-down        Arrêter le service nginx"
	@echo "  make nginx-restart     Redémarrer le service nginx"
	@echo "  make nginx-logs        Afficher les logs du service nginx"
	@echo "  make build-nginx       Construire l'image de nginx"
	@echo ""
	@echo "Service Backend :"
	@echo "  make backend-up        Démarrer le service backend"
	@echo "  make backend-down      Arrêter le service backend"
	@echo "  make backend-restart   Redémarrer le service backend"
	@echo "  make backend-logs      Afficher les logs du service backend"
	@echo "  make build-backend     Construire l'image du backend"
	@echo ""
	@echo "Service Adminer :"
	@echo "  make adminer-up        Démarrer le service adminer"
	@echo "  make adminer-down      Arrêter le service adminer"
	@echo "  make adminer-restart   Redémarrer le service adminer"
	@echo "  make adminer-logs      Afficher les logs du service adminer"
	@echo ""
	@echo "Service Database :"
	@echo "  make database-up       Démarrer le service database"
	@echo "  make database-down     Arrêter le service database"
	@echo "  make database-restart  Redémarrer le service database"
	@echo "  make database-logs     Afficher les logs du service database"
	@echo "  make build-database    Construire l'image de la base de données"
	@echo ""
	@echo "Autres commandes :"
	@echo "  make clean-node-modules Supprimer les dossiers node_modules"

# Commandes générales
build: 
	$(DOCKER_COMPOSE) build

up: 
	$(DOCKER_COMPOSE) up -d

down: 
	$(DOCKER_COMPOSE) down

restart: 
	$(DOCKER_COMPOSE) restart

logs: 
	$(DOCKER_COMPOSE) logs -f

clean:
	$(DOCKER_COMPOSE) down -v --rmi all --remove-orphans

clean-node-modules:
	rm -rf ./frontend/node_modules ./backend/node_modules
	@echo "Dossiers node_modules supprimés."

prune:
	docker system prune -af

re:
	$(MAKE) clean
	$(MAKE) build
	$(MAKE) up

du:
	$(MAKE) down
	$(MAKE) up
	$(MAKE) build

# Service Frontend
frontend-up:
	$(DOCKER_COMPOSE) up -d frontend

frontend-down:
	$(DOCKER_COMPOSE) down frontend

frontend-restart:
	$(DOCKER_COMPOSE) restart frontend

frontend-logs:
	$(DOCKER_COMPOSE) logs -f frontend

build-frontend:
	$(DOCKER_COMPOSE) build frontend

# Service Nginx
nginx-up:
	$(DOCKER_COMPOSE) up -d nginx

nginx-down:
	$(DOCKER_COMPOSE) down nginx

nginx-restart:
	$(DOCKER_COMPOSE) restart nginx

nginx-logs:
	$(DOCKER_COMPOSE) logs -f nginx

build-nginx:
	$(DOCKER_COMPOSE) build nginx

# Service Backend
backend-up:
	$(DOCKER_COMPOSE) up -d backend

backend-down:
	$(DOCKER_COMPOSE) down backend

backend-restart:
	$(DOCKER_COMPOSE) restart backend

backend-logs:
	$(DOCKER_COMPOSE) logs -f backend

build-backend:
	$(DOCKER_COMPOSE) build backend

# Service Adminer
adminer-up:
	$(DOCKER_COMPOSE) up -d adminer

adminer-down:
	$(DOCKER_COMPOSE) down adminer

adminer-restart:
	$(DOCKER_COMPOSE) restart adminer

adminer-logs:
	$(DOCKER_COMPOSE) logs -f adminer

# Service Database
database-up:
	$(DOCKER_COMPOSE) up -d data-base

database-down:
	$(DOCKER_COMPOSE) down data-base

database-restart:
	$(DOCKER_COMPOSE) restart data-base

database-logs:
	$(DOCKER_COMPOSE) logs -f data-base

build-database:
	$(DOCKER_COMPOSE) build data-base
