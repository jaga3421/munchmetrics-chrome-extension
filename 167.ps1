# Fetch changes from remote
try {
    git fetch
    Write-Host "Fetch successful!" -ForegroundColor Green
} catch {
    Write-Host "Error fetching changes: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Check for unpushed commits
$aheadCount = (git status -sb | Select-String -Pattern "ahead").Line.Split(' ')[2]

# If there are unpushed commits
if ($aheadCount -ne "0") {
    Write-Host "You have $aheadCount unpushed commits."

    # Display commit details
    Write-Host "Commit details:"
    git log '@{u}..HEAD' --pretty=format:"%h %ad | %s%d [%an]" --date=short
} else {
    Write-Host "No unpushed commits found."
}
