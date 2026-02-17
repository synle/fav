curl -s -- https://raw.githubusercontent.com/synle/gha-workflow/refs/heads/main/dev.sh | \
bash -s -- '*.jsx *.scss *.json' 'npm run start'
