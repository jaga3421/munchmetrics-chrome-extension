# Get today's date in dd-mmm-yyyy format
$today = Get-Date -Format "dd-MMM-yyyy"

# Fetch latest changes from remote
git fetch

# Stage all changes
git add .

# Create a new branch with today's date
git checkout -b "temp/$today"

# Get the current timestamp
$timestamp = Get-Date -Format "HH:mm:ss"

# Prompt user for commit message
$message = Read-Host "Enter commit message: "

# Commit the changes with timestamp and user message
git commit -m "emergency commit @$timestamp $message"

# Push the changes to the remote repository
git push --set-upstream origin "temp/$today"

Write-Host "Changes committed and pushed to branch temp/$today"