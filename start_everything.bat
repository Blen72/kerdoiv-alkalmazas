@echo off

echo starting server...
cd server
start start_server.bat build
cd ..
echo starting client...
cd client\kerdoiv-alkalmazas
start ng serve
echo EXITING
cd ..\..