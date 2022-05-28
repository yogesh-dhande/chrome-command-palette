import splitbee from "@splitbee/web";

export default defineNuxtPlugin(() => {
  splitbee.init();
  return {
    provide: {
      splitbee,
    },
  };
});
