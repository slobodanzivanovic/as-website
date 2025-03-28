#!/bin/bash

mkdir -p docker

if [ ! -f "docker/apache-config.conf" ]; then
    echo "Apache config file not found. Creating it..."
    cp apache-config.conf docker/apache-config.conf 2>/dev/null || echo "Warning: Could not copy apache-config.conf"
fi

docker-compose up -d --build

echo "Docker environment started successfully!"
echo "Your website is available at: http://localhost:8080"
echo "To stop the environment, run: docker-compose down"