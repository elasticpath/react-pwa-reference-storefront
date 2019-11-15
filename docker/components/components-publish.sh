#!/bin/bash
publishDirName="components"
isChanged=$(
    # Difference in 2 last commits
    git diff --name-only HEAD^ HEAD |
    # Get only that starts with components so only component folder
    grep "^${publishDirName}/" |
    # Get first one
    head -1 |
    # Cut all after /
    cut -d / -f 1
)

if [[ ${isChanged} == ${publishDirName} ]]
then
    git config --global user.name $(${GIT_USERNAME})
    git config --global user.email 'build@admin.com'
    git checkout RS-516-automate-version-increment
    # regex: (?s).*skip_ci.*
    npm version patch -m "Components %s skip_ci"
    # npm publish components
    git push "${GIT_USERNAME}:${GIT_PASSWORD}@${GIT_URL}"
    exit 0
fi
echo "No changes in components folder"
exit 0
