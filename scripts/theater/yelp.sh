#!/bin/bash

API="http://localhost:4741"
URL_PATH="/searchtheater"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \

echo
