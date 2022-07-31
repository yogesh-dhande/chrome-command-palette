const functions = require("firebase-functions");
const packs = require("./packs/packs.json");
const { cors } = require("./utils");

exports.getPacks = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      console.log(packs);
      return res.status(200).send(packs);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  });
});
