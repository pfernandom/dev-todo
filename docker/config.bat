set host=%1
echo %host%

if [%host%] == [] (
    SET host=http://localhost:32770
)

curl -X PUT %host%/_config/httpd/enable_cors -d "\"true\""
curl -X PUT %host%/_config/cors/origins -d "\"*\""
curl -X PUT %host%/_config/cors/credentials -d "\"true\""
curl -X PUT %host%/_config/cors/methods -d "\"GET, PUT, POST, HEAD, DELETE\""
curl -X PUT %host%/_config/cors/headers -d "\"accept, authorization, content-type, origin, referer, x-csrf-token\""
curl -X PUT %host%/todos
