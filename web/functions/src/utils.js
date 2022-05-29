const { auth } = require("./app");

exports.cors = require("cors")({
  origin: [
    "https://singledispatch.com",
    "https://www.singledispatch.com",
    "https://singledispatch.web.app",
    "http://localhost:3000",
  ],
});

exports.isEmpty = (obj) => {
  return (
    obj && // 👈 null and undefined check
    Object.keys(obj).length === 0 &&
    obj.constructor === Object
  );
};

exports.getUIDFromRequest = async (req) => {
  const decodedToken = await auth.verifyIdToken(
    req.get("authorization").replace("Bearer ", "")
  );
  return decodedToken.uid;
};
