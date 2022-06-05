import splitbee from "@splitbee/web";

export default defineNuxtPlugin(() => {
  let analytics;
  if (process.env.NODE_ENV !== "production") {
    analytics = {
      track(data) {
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
