(cd functions && cat src/packs/yaml/*.yaml | yq . > src/packs/packs.json)
yarn deploy