(cd functions && cat src/packs/yaml/*.yaml | yq -o=json e '.' - > src/packs/packs.json)
# (cd functions && cat src/packs/yaml/*.yaml | yq . > src/packs/packs.json)
yarn deploy