#!/bin/bash
MODE=$1

npm run build $MODE
# CSS_FILE=$(cd  dist/content-scripts && ls main*.css)
# sed -i '' s=styles\/main.css=content-scripts\/$CSS_FILE=g dist/service_worker.js
# rm -r dist/styles/
zip -r singledispatch.zip dist