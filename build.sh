echo 'Download index.html template'
curl -s -S -o index.html https://synle.github.io/nav-generator/index.template.html

echo 'Download dev.sh template'
curl -s -S -o dev.sh https://synle.github.io/nav-generator/dev.sh

echo 'Build / Clean URL Porter JSON Config'
curl -s -S https://synle.github.io/url-porter/url-porter.clean-config.js | node
