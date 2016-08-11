#!/usr/bin/env bash
# Generates ssh key pairs for jenkins
# exchanges them with the local git server


cd /var/lib/jenkins

mkdir -p .ssh
chmod 700 .ssh
ssh-keygen -f .ssh/jenkins_rsa -t rsa -N ''
chown -R jenkins:jenkins .ssh

PUB_KEY=`cat .ssh/jenkins_rsa.pub`
su git -c "echo ${PUB_KEY} >> ~/.ssh/authorized_keys"