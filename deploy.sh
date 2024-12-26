#!/bin/bash

# Navigate to your project directory
cd rating-guessr

# Stop and remove existing containers and volumes
docker compose down --volumes

# Pull the latest changes from Git
git pull origin main

# Build new images and start containers
docker compose up -d --build