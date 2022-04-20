#!/bin/bash
cat src/packs/* | yq . | > src/content-scripts/packs.json
npm run build