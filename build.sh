sh format.sh

echo 'Download index.html template'
curl -s -S -o index.html https://synle.github.io/nav-generator/index.template.html

echo 'Build URL Porter JSON'
node url-porter.build.js
