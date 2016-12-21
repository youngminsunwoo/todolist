#!/usr/bin/env bash

# # run :: traffic-light.sh <enviromnent> <function_name>
# eg ./scripts/traffic-light.sh test check_mongo

set -o errexit

environ=${1}; shift

if [ "$environ" == "si" ]; then
	port=9002
elif [ "$environ" == "test" ]; then
	port=9000
elif [ "$environ" == "prod" ]; then
	port=80
else
	echo "NO VALID ENVIRONMENT FOUND"
fi



function check_mongo() {
	collection=`mongo --quiet mongo.server/todolist-${environ} --eval "printjson(db.todos.count())"`
	echo "Collection size  = $collection"
	if [ $collection -lt 1 ];then
		echo "TEST FAILED - collection must contain at least 1 item. Has the seed job run? Make sure that a deploy has occurred to this environment."
		exit 9999
	fi
}

function check_frontend() {
	curl http://localhost:${port}
	response=$?
	echo "Response = "$response
	if [ $response -gt 0 ];then
		echo "TEST FAILED"
		exit $?
	fi
}

function check_show() {
	curl http://localhost:${port}/api/todos
	response=$?
	echo "Response = "$response
	if [ $response -gt 0 ];then
		echo "TEST FAILED"
		exit $?
	fi
}

function check_create() {
	curl -X POST http://localhost:${port}/api/todos
	response=$?
	echo "Response = "$response
	if [ $response -gt 0 ];then
		echo "TEST FAILED"
		exit $?
	fi
}

$@