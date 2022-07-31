<template>
  <div class="sd-p-8 sd-text-center">
    Please
    <a
      :href="`${baseUrl}/login`"
      target="_blank"
      @click="recordTab"
      class="
        sd-font-bold
        sd-text-cyan-300
        visited:sd-text-cyan-300
        focus:sd-px-2
        focus:sd-py-1
        focus:sd-mx-2
        focus:sd-ring-cyan-100
        focus:sd-outline-cyan-200
      "
      >Log In</a
    >
    or
    <a
      :href="`${baseUrl}/register`"
      target="_blank"
      @click="recordTab"
      class="
        sd-font-bold
        sd-text-teal-300
        visited:sd-text-teal-300
        focus:sd-px-2
        focus:sd-mx-2
        focus:sd-py-1
        focus:sd-ring-teal-100
        focus:sd-outline-teal-200
      "
      >Sign Up</a
    >
    to use the
    <span
      class="
        sd-font-bold
        leading-tight
        tracking-tight
        sd-bg-clisd-p-text
        sd-text-transparent
        sd-bg-gradient-to-r
        frosd-m-cyan-300
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