#!/usr/bin/env bash
npm install
pip3 install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
./node_modules/.bin/webpack --config webpack.config.js
