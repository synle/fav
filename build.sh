echo 'Download index.html template'
curl -s -S -o index.html https://synle.github.io/nav-generator/index.template.html

echo 'Download dev.sh template'
curl -s -S -o dev.sh https://synle.github.io/nav-generator/dev.sh

echo 'Build URL Porter JSON'
node url-porter.build.js
