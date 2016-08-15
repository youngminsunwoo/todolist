#!/usr/bin/env bash
# Restarts the container passed in 

# # run ::
# chmod +x ./scripts/jenkins-restart-app.sh
# eg ./scripts/jenkins-restart-app.sh todo-app-ci todolist-build:12

environ=${1}
tag=${2}

if [[ -z ${environ} || -z ${tag} ]]
 then echo "no param passed to script, must provide enviroment and tag"
 exit 1;
fi

echo "DOCKER STOPPING CONTAINER " todo-app-${environ}
docker stop todo-app-${environ} && rc=$?

echo "DOCKER REMOVING CONTAINER " todo-app-${environ}
docker rm todo-app-${environ} && rc=$?


echo "DOCKER STARTING CONTAINER " todo-app-${environ}
if [ "$environ" == "ci" ]; then
  port=9001
  docker run -t -d --name todo-app-${environ} -p ${port}:9000 --env NODE_ENV=${environ} todo-app:${tag}
elif [ "$environ" == "si" ]; then
  port=9002
  docker run -t -d --name todo-app-${environ} --link devops-mongo:mongo  -p ${port}:9000 --env NODE_ENV=${environ} todo-app:${tag}  
elif [ "$environ" == "production" ]; then
  port=80
  docker run -t -d --name todo-app-${environ} --link devops-mongo:mongo  -p ${port}:9000 --env NODE_ENV=${environ} todo-app:${tag}  
else 
  echo "ENV not set"
  exit 1;
fi
