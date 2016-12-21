#!/usr/bin/env bash
# Restarts the container passed in 

# # run ::
# chmod +x ./scripts/jenkins-restart-app.sh
# eg ./scripts/jenkins-restart-app.sh todolist-ci todolist-build:12

environ=${1}
tag=${2}

if [[ -z ${environ} || -z ${tag} ]]
 then echo "no param passed to script, must provide enviroment and tag"
 exit 1;
fi

echo "DOCKER STOPPING CONTAINER " todolist-${environ}
docker stop todolist-${environ} && rc=$?

echo "DOCKER REMOVING CONTAINER " todolist-${environ}
docker rm todolist-${environ} && rc=$?


echo "DOCKER STARTING CONTAINER " todolist-${environ}
if [ "$environ" == "ci" ]; then
  port=9001
  docker run -t -d --name todolist-${environ} -p ${port}:${port} --env NODE_ENV=${environ} todolist:${tag}
elif [ "$environ" == "si" ]; then
  port=9002
  docker run -t -d --name todolist-${environ} --link devops-mongo:mongo.server  -p ${port}:${port} --env NODE_ENV=${environ} todolist:${tag}  
elif [ "$environ" == "production" ]; then
  port=80
  docker run -t -d --name todolist-${environ} --link devops-mongo:mongo.server  -p ${port}:${port} --env NODE_ENV=${environ} todolist:${tag}  
else 
  echo "ENV not set"
  exit 1;
fi
