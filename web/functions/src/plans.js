const functions = require("firebase-functions");
const { cors, getUIDFromRequest } = require("./utils");
const { db } = require("./app");

exports.upgradePlan = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      const uid = await getUIDFromRequest(req);
      await db.doc(`users/${uid}`).update({ plan: "paid" });
      return res.status(200).send("ok");
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  });
});
