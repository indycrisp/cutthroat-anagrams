#!/bin/bash

stopall="forever stopall"
grunt="./node_modules/grunt/bin/grunt prod"
jst="./node_modules/grunt/.bin/grunt jst"
hashres="./node_modules/grunt/.bin/grunt hashres"
webpack="./node_modules/webpack/.bin/webpack"
run="forever start app.js --prod"
$stopall
$grunt
$webpack
$jst
$hashres
$run &
