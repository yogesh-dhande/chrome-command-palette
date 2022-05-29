import { getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { useStore } from "~/store";

export default defineNuxtPlugin((nuxtApp) => {
  const store = useStore(nuxtApp.$pinia);
  const config = useRuntimeConfig().public;

  const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId,
  };

  let firebaseApp;
  const apps = getApps();
  if (!apps.length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = apps[0];
  }

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const functions = getFunctions(firebaseApp);

  if (config.useFirebaseEmulators) {
    connectAuthEmulator(auth, "http://localhost:10000");
    connectFunctionsEmulator(functions, "localhost", 10001);
    connectFirestoreEmulator(db, "localhost", 10002);
  }

  const sendVerificationEmail = (authUser) => {
    sendEmailVerification(authUser, {
      url: `${config.baseUrl}/`,
    });
  };

  const firebase = {
    db,
    auth,
    functions,
    sendVerificationEmail,
  };

  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (authUser) => {
      await store.onAuthStateChangedAction(authUser);
      return resolve({
        provide: {
          firebase,
        },
      });
    });
  });
});
