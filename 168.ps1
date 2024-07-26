# Get today's date in dd-mmm-yyyy format
$today = Get-Date -Format "dd-MMM-yyyy"

# Get the current timestamp
$timestamp = Get-Date -Format "HH:mm:ss"

# Prompt for user input message
$userInputMessage = Read-Host "Enter your commit message"

# Perform git fetch
git fetch

# Stage all changes
git add .

# Create a new branch with today's date
git checkout -b "temp/$today"

# Commit the changes with timestamp and user input message
git commit -m "emergency commit @$timestamp $userInputMessage"

# Output success message
Write-Host "Successfully committed changes to branch 'temp/$today'."