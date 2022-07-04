#!/bin/bash
MODE=$1
npm run build $MODE
zip -r singledispatch.zip dist