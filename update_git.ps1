Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Updating Dhara Foundations GitHub Repos" -ForegroundColor Cyan
Write-Host " Repositories:" -ForegroundColor Cyan
Write-Host " 1. https://github.com/sounderrajan-07/dharadivineawards.git" -ForegroundColor Cyan
Write-Host " 2. https://github.com/projectsatriowings/dharadivineawards.git" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Staging and Committing Changes
Write-Host "`n[1/4] Staging files..." -ForegroundColor Yellow
git add .

Write-Host "[2/4] Creating commit..." -ForegroundColor Yellow
git commit -m "Fix syntax errors in api.js and EventRegistration.jsx for Vercel build"

# 2. Pulling remote updates with rebase
Write-Host "`n[3/4] Pulling remote updates..." -ForegroundColor Yellow
git pull https://github.com/sounderrajan-07/dharadivineawards.git main --rebase

# 3. Pushing to target repos
Write-Host "`n[4/4] Pushing to https://github.com/sounderrajan-07/dharadivineawards.git..." -ForegroundColor Yellow
git push https://github.com/sounderrajan-07/dharadivineawards.git HEAD:main

Write-Host "Pushing to https://github.com/projectsatriowings/dharadivineawards.git..." -ForegroundColor Yellow
git push https://github.com/projectsatriowings/dharadivineawards.git HEAD:main

Write-Host "`nSuccessfully pushed changes to all GitHub repositories!" -ForegroundColor Green
