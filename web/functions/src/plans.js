const functions = require("firebase-functions");
const { cors, getUIDFromRequest } = require("./utils");
const { db } = require("./app");

const plans = {
  free: {},
  paid: {},
};

exports.upgradePlan = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      const uid = await getUIDFromRequest(req);
      await db.doc(`readonly/${uid}`).update({ plan: "paid" });
      return res.status(200).send("ok");
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  });
});

exports.getReadonly = async (uid) => {
  const doc = await db.collection("readonly").doc(uid).get();

  const readonly = doc.data();
  console.log(readonly.plan);
  readonly.plan = plans[readonly.plan];
  console.log(readonly.plan);
  return readonly;
};
