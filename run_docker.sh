docker rmi $(docker images -a -q) -f;

docker rm $(docker ps -a -q) -f;

rm -rf app/node_modules;
rm -rf api/node_modules;

docker compose up;