#!/usr/bin/env bash
# Generates ssh key pairs for jenkins
# exchanges them with the local git server


cd /var/lib/jenkins

mkdir ~/.ssh
chmod 700 ~/.ssh
ssh-keygen -t rsa -N ''
chown -R jenkins:jenkins ~/.ssh

PUB_KEY=`cat ~/.ssh/id_rsa.pub`
sh git -c "echo ${PUB_KEY} >> ~/.ssh/authorized_keys"

