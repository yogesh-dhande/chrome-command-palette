# Single Dispatch

## Develop locally
- Start firebase functions emulator
    `cd web`
    `(cd functions && cat src/packs/yaml/*.yaml | yq -o=json e '.' - > src/packs/packs.json)  && npm run firebase`
- Build a devlopment version of the extension
    `cd extension`
    `./build.sh staging`


## Deploy
- Build a prod version of the extension
    `./build.sh production`
- Deploy firebase functions
    `cd web`
    `./deploy.sh`