<template>
  <div class="p-8 text-center">
    Please
    <a
      :href="`${baseUrl}/login`"
      target="_blank"
      @click="recordTab"
      class="
        font-bold
        text-cyan-300
        visited:text-cyan-300
        focus:px-2
        focus:py-1
        focus:mx-2
        focus:ring-cyan-100
        focus:outline-cyan-200
      "
      >Log In</a
    >
    or
    <a
      :href="`${baseUrl}/register`"
      target="_blank"
      @click="recordTab"
      class="
        font-bold
        text-teal-300
        visited:text-teal-300
        focus:px-2
        focus:mx-2
        focus:py-1
        focus:ring-teal-100
        focus:outline-teal-200
      "
      >Sign Up</a
    >
    to use the
    <span
      class="
        font-bold
        leading-tight
        tracking-tight
        bg-clip-text
        text-transparent
        bg-gradient-to-r
        from-cyan-300
        to-teal-300
      "
      >Single Dispatch</span
    >
    command palette.
  </div>
</template>

<script>
export default {
  data() {
    console.log(import.meta.env);
    return {
      baseUrl: import.meta.env.VITE_BASE_URL,
    };
  },
  methods: {
    recordTab() {
      this.$emit("close");
      chrome.runtime.sendMessage({
        type: "RECORD_TAB",
      });
    },
  },
};
</script>

<style>
</style>