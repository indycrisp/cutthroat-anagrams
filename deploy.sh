#!/bin/bash

stopall="forever stopall"
grunt="./node_modules/grunt/bin/grunt prod"
run="forever start app.js --prod"
$stopall
$grunt
$run &
