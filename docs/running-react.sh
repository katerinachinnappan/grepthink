#!/usr/bin/env bash
npm install
pip3 install -r requirements.txt
./node_modules/.bin/webpack --config webpack.config.js
4
