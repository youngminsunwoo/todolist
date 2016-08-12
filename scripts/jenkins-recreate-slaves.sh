#!/usr/bin/env bash
# stops and removes containers matching $image_name-
# reruns number of slaves with port range starting template_port+1

# # run ::
# chmod +x ./scripts/jenkins-recreate-slaves.sh
# ./scripts/jenkins-recreate-slaves.sh jenkins-bluemix-slave 2210 5

image_name=${1}; shift
template_port=${1}; shift
number_of_slaves=${1}
if [[ -z ${image_name} || -z ${template_port} || -z ${number_of_slaves} ]]
 then echo "no param passed to script, must atleast provide a base image name"
 exit 1;
fi

echo "tearing down containers"
for slave in `docker ps | grep "${image_name}-" | awk -F' ' '{ print $1 }'`
 do
    echo "stopping $slave"
    docker stop $slave
 done
for slave in `docker ps -a | grep "${image_name}-" | awk -F' ' '{ print $1 }'`
 do
    echo "removing $slave"
    docker rm $slave
 done

echo "determining the docker host net address from /etc/hosts"
docker_host=$(cat /etc/hosts | egrep -o '^[[:space:]]*[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}[[:space:]]+docker.local[[:space:]]*$' | egrep -o '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}')

if [[ -z ${docker_host} ]]
 then echo 'ERROR docker host address not found in /etc/hosts'
 exit 1
fi

port=$((template_port))
while [ ${port} -le $((template_port+number_of_slaves)) ]
 do
   echo "running docker container ${image_name}-${port}"
   docker run -p ${port}:22 -t -i -d --name ${image_name}-${port} \
    	--add-host="docker.host:${docker_host}" \
    	${image_name}
   		port=$((port+1))
 done
