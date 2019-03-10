#!/bin/sh

API="http://localhost:4741"
URL_PATH="/users"

curl "${API}${URL_PATH}/${ID}/favorite" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
      "movies":["5c8452eeff225c53ad5e00fd"]
    }'
echo
