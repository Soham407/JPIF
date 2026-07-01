#!/bin/bash

# Ensure script stops on first error
set -e

# Working directory should be the project root
cd "$(dirname "$0")"

echo "=== JPIF GO LIVE UTILITY ==="

# 1. Check if index1.html exists
if [ ! -f "index1.html" ]; then
  echo "Error: index1.html not found. The website might already be live!"
  exit 1
fi

# 2. Remove the Coming Soon page (index.html)
echo "Removing Coming Soon index.html..."
rm index.html

# 3. Rename index1.html to index.html
echo "Renaming index1.html to index.html..."
mv index1.html index.html

# 4. Update redirects inside video.html
echo "Updating redirects in video.html to index.html..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS compatibility
  sed -i '' 's/index1.html/index.html/g' video.html
else
  # Linux compatibility
  sed -i 's/index1.html/index.html/g' video.html
fi

# 5. Git Commit and Push
echo "Committing changes and pushing to main branch..."
git add .
git commit -m "Go Live: Promote index1 to main homepage and update video redirection"
git push origin main

echo "=== SUCCESS: The website is now live! ==="
