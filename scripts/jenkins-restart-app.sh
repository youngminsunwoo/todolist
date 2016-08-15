#!/usr/bin/env bash
# Restarts the container passed in 

# # run ::
# chmod +x ./scripts/jenkins-restart-app.sh
# eg ./scripts/jenkins-restart-app.sh todo-app-ci todolist-build:12

env=${1}
tag=${2}

if [[ -z ${env} || -z ${tag} ]]
 then echo "no param passed to script, must provide enviroment and tag"
 exit 1;
fi

echo "DOCKER STOPPING CONTAINER " todo-app-${env}
docker stop todo-app-${env} && rc=$?

echo "\nDOCKER REMOVING CONTAINER " todo-app-${env}
docker rm todo-app-${env} && rc=$?


echo "\nDOCKER STARTING CONTAINER " todo-app-${env}
if [ "$env" == "ci" ]; then
	port=9001
	docker run -t -d --name todo-app-${env} -p ${port}:9000 --env NODE_ENV=${env} todo-app:${tag}
elif [ "$env" == "si" ]; then
	port=9002
	docker run -t -d --name todo-app-${env} --link devops-mongo:mongo  -p ${port}:9000 --env NODE_ENV=${env} todo-app:${tag}	
elif [ "$env" == "production" ]; then
	port=80
	docker run -t -d --name todo-app-${env} --link devops-mongo:mongo  -p ${port}:9000 --env NODE_ENV=${env} todo-app:${tag}	
