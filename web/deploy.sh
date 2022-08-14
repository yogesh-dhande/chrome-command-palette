(cd functions && cat src/packs/yaml/*.yaml | yq -o=json e '.' - > src/packs/packs.json)  # old laptop
# (cd functions && cat src/packs/yaml/*.yaml | yq . > src/packs/packs.json) # new laptop
yarn deploy