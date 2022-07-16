(cd functions && cat src/packs/yaml/*.yaml | yq -o=json e '.' - > src/packs/packs.json)
yarn deploy