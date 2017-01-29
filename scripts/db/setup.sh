#!/bin/sh

# Run the MySQL container, with a database named 'users' and credentials
# for a users-service user which can access it.
echo "Starting DB..."  
docker run --name robocodecup_db -d -e MYSQL_ROOT_PASSWORD=123 -e MYSQL_DATABASE=robocodecup -e MYSQL_USER=robocodecup_service -e MYSQL_PASSWORD=123 -p 3306:3306 mysql:latest

# Wait for the database service to start up.
echo "Waiting for DB to start up..."  
docker exec robocodecup_db mysqladmin --silent --wait=30 -urobocodecup_service -p123 ping || exit 1

# Run the setup script.
echo "Setting up initial data..."  
docker exec -i robocodecup_db mysql -urobocodecup_service -p123 robocodecup < setup.sql 
