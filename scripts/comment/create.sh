#!/bin/bash

API="http://localhost:4741"
URL_PATH="/movies"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "movie": {
      "title": "'"a"'",
      "description": "'"aa"'",
      "imageUrl": "fdaf",
      "publishDate": "1992-07-20"
    }
  }'

echo
