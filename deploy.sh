#!/bin/bash

stopall="forever stopall"
run="forever start app.js"
$stopall
$run &
