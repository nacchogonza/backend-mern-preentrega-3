
import admin from "firebase-admin";
import serviceAccount from "./backend-mern-780d4-firebase-adminsdk-28rb8-2b9cfa6924.json";

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export { firebaseAdmin }