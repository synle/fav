echo 'Download index.html template'
curl -s -S -o index.html https://synle.github.io/nav-generator/index.template.html

echo 'Download dev.sh template'
curl -s -S -o dev.sh https://synle.github.io/nav-generator/dev.sh

echo 'Build / Clean URL Porter JSON Config'
curl -s -S -L https://raw.githubusercontent.com/synle/url-porter/main/url-porter.clean-config.js | node
