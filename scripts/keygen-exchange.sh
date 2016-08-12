#!/usr/bin/env bash
# Generates ssh key pairs for jenkins
# exchanges them with the local git server


HOME=${1}
USER=${2}

if [[ -z ${HOME} || -z ${USER} ]];then 
	echo "Using defaults HOME=/var/lib/jenkins & USER=jenkins"
	HOME="/var/lib/jenkins"
	USER="jenkins"
fi

cd ${HOME}

mkdir -p .ssh
chmod 700 .ssh
ssh-keygen -f .ssh/id_rsa -t rsa -N ''
chown -R ${USER}:${USER} .ssh

PUB_KEY=`cat .ssh/${USER}_rsa.pub`
su git -c "echo ${PUB_KEY} >> ~/.ssh/authorized_keys"