# Getting Started with Matcha Project

In the project directory, you can run the following commands:

### `make up`

This command will build all Docker images and start all services (frontend, backend, Nginx, and database). It sets up the project in a development environment.

### `make clean && make clean-node-modules`

If you want to clean the environment, stop and remove all containers, volumes, and images, run:

```bash
make clean && make clean-node-modules
