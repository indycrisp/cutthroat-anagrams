#!/bin/bash

stopall="forever stopall"
grunt="./node_modules/grunt/bin/grunt prod"
#jst="./node_modules/.bin/grunt jst"
#hashres="./node_modules/.bin/grunt hashres"
#webpack="./node_modules/.bin/webpack"
run="forever start app.js --prod"
$stopall
$grunt
#$webpack
#$jst
#$hashres
$run &
