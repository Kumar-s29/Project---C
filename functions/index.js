const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNoticeNotification = functions.firestore
  .document("notices/{noticeId}")
  .onCreate(async (snap, context) => {
    const newNotice = snap.data();

    const payload = {
      notification: {
        title: "📢 New Notice Uploaded!",
        body: newNotice.title || "Check out the latest notice.",
        icon: "/logo.png",
      },
    };

    // Get all device tokens from Firestore (or your DB)
    const tokensSnapshot = await admin.firestore().collection("tokens").get();

    const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

    if (tokens.length > 0) {
      return admin.messaging().sendToDevice(tokens, payload);
    }

    return null;
  });
