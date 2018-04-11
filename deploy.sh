#!/bin/bash

stopall="forever stopall"
run="forever start app.js --prod"
$stopall
$run &
