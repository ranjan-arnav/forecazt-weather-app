@echo off
echo ====================================
echo   Forecazt Weather App Deployment
echo ====================================
echo.

echo Please create a GitHub repository first:
echo 1. Go to https://github.com
echo 2. Create new repository: "forecazt-weather-app"
echo 3. Make it PUBLIC (required for free GitHub Pages)
echo 4. Don't initialize with README
echo.

set /p username="Enter your GitHub username: "
set /p confirm="Ready to deploy? (y/n): "

if /i "%confirm%"=="y" (
    echo.
    echo Adding GitHub remote...
    git remote add origin https://github.com/%username%/forecazt-weather-app.git
    
    echo.
    echo Pushing to GitHub...
    git push -u origin main
    
    echo.
    echo ====================================
    echo   SUCCESS! Your app is deploying...
    echo ====================================
    echo.
    echo Next steps:
    echo 1. Go to: https://github.com/%username%/forecazt-weather-app
    echo 2. Click Settings ^> Pages
    echo 3. Select "GitHub Actions" as source
    echo 4. Your app will be live at:
    echo    https://%username%.github.io/forecazt-weather-app/
    echo.
    echo Deployment takes 2-3 minutes...
    echo.
    pause
) else (
    echo Deployment cancelled. Run this script when ready!
    pause
)
