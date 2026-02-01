sh format.sh

echo 'Download Import Map JSON'
curl -o import-map.json https://synle.github.io/nav-generator/import-map.json

echo 'Download index.html template'
curl -o index.html https://synle.github.io/nav-generator/index.template.html
