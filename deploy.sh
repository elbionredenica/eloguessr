#!/bin/bash

# Navigate to your project directory
cd /root/eloguessr

# Stop and remove existing containers and volumes
docker compose down -v  # Use -v instead of --volumes

# Pull the latest changes from Git
git pull origin main

# Build new images and start containers
docker compose up --build -d  # Use --build before -d