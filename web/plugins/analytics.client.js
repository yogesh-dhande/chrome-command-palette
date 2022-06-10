import splitbee from "@splitbee/web";

export default defineNuxtPlugin(() => {
  let analytics;
  if (process.env.NODE_ENV !== "production") {
    analytics = {
      track(msg, data) {
        console.log(msg);
        console.log(data);
      },
    };
  } else {
    splitbee.init();
  }
  return {
    provide: {
      analytics,
    },
  };
});
