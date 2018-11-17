#!/bin/bash

stopall="forever stopall"
grunt="./node_modules/grunt/bin/grunt prod"
webpack="./node_modules/webpack/bin/webpack"
run="forever start app.js --prod"
$stopall
$grunt
$webpack
$run &
