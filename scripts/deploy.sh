pm2 stop api
cd projects/api
rm -rf build node_modules
git pull
npm i
npm run build
pm2 start api