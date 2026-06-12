const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.resetPasswordWithOTP = functions.https.onCall(
  async (data, context) => {
    try {
      const { email, otp, newPassword } = data;

      if (!email || !otp || !newPassword) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Missing required fields."
        );
      }

      const db = admin.firestore();

      const snapshot = await db
        .collection("password_reset_otps")
        .where("email", "==", email)
        .where("otp", "==", otp)
        .where("verified", "==", true)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new functions.https.HttpsError(
          "not-found",
          "Invalid OTP."
        );
      }

      const otpDoc = snapshot.docs[0];
      const otpData = otpDoc.data();

      if (
        otpData.expiresAt.toDate() < new Date()
      ) {
        throw new functions.https.HttpsError(
          "deadline-exceeded",
          "OTP expired."
        );
      }

      const user =
        await admin.auth().getUserByEmail(email);

      await admin.auth().updateUser(user.uid, {
        password: newPassword,
      });

      await otpDoc.ref.delete();

      return {
        success: true,
        message:
          "Password updated successfully.",
      };
    } catch (error) {
      throw new functions.https.HttpsError(
        "internal",
        error.message
      );
    }
  }
);