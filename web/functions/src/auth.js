const functions = require("firebase-functions");
const { db, auth, admin } = require("./app");
const { cors } = require("./utils");

exports.createCustomToken = functions.https.onCall((uid) =>
  admin.auth().createCustomToken(uid)
);

exports.signUp = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      const newUser = {
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation,
      };

      console.log(newUser);

      if (newUser.password !== newUser.passwordConfirmation) {
        return res.status(403).json({ message: "Passwords do not match" });
      }

      console.log("creating user");
      let user = await auth.createUser({
        email: newUser.email,
        password: newUser.password,
        emailVerified: false,
      });

      let userDoc = {
        id: user.uid,
        email: user.email,
        created: admin.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection("users").doc(user.uid).set(userDoc);
      await db.collection("readonly").doc(user.uid).set({
        id: user.uid,
        plan: "free",
      });
      return res.status(200).send(newUser);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  });
});
