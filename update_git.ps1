Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Updating Dhara Foundations GitHub Repos" -ForegroundColor Cyan
Write-Host " Repositories:" -ForegroundColor Cyan
Write-Host " 1. https://github.com/sounderrajan-07/dharadivineawards.git" -ForegroundColor Cyan
Write-Host " 2. https://github.com/projectsatriowings/dharadivineawards.git" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Staging and Committing Changes
Write-Host "`n[1/3] Staging files..." -ForegroundColor Yellow
git add .

Write-Host "[2/3] Creating fresh commit..." -ForegroundColor Yellow
git commit -m "Enforce mandatory payment screenshot upload for UPI QR payments and fix image persistence"

# 2. Pushing to target repos
Write-Host "`n[3/3] Pushing to https://github.com/sounderrajan-07/dharadivineawards.git..." -ForegroundColor Yellow
git push https://github.com/sounderrajan-07/dharadivineawards.git HEAD:main --force

Write-Host "Pushing to https://github.com/projectsatriowings/dharadivineawards.git..." -ForegroundColor Yellow
git push https://github.com/projectsatriowings/dharadivineawards.git HEAD:main --force

Write-Host "`nSuccessfully pushed changes to all GitHub repositories!" -ForegroundColor Green
