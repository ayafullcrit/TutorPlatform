@echo off
echo Starting TutorPlatform API and Client...

echo Starting Backend...
start "TutorPlatform API" cmd /k "cd TutorPlatform.API && dotnet run"

echo Starting Frontend...
start "TutorPlatform Client" cmd /k "cd TutorPlatform.Client\my-app && npm start"

echo Both services are starting!
