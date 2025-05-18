@echo off

if [%1]==[build] docker build -t mongo_server .
start docker run -it --rm --name kerdoiv-alkalmazas-server -p 27017:27017 -v %cd%/serverfiles:/data/db mongo_server

if [%1]==[build] npm run build

REM comment
:: comment
::docker run -d --name kerdoiv-alkalmazas-server -p 27017:27017 -v serverfiles:/data/db mongo

exit 0