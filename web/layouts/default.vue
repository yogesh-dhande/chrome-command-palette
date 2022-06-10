<template>
  <div class="bg-gray-900 text-cyan-50">
    <div class="min-h-screen">
      <NavBar
        class="
          sticky
          top-0
          z-50
          bg-gray-900 bg-opacity-50
          backdrop-blur backdrop-filter
        "
        :class="{
          'shadow-2xl bg-gray-900 border-b-2 border-gray-900 border-opacity-75':
            !view.atTopOfPage,
        }"
      />
      <slot />
      <Footer />
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      view: {
        atTopOfPage: true,
      },
    };
  },

  // a beforeMount call to add a listener to the window
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },

  methods: {
    // the function to call when the user scrolls, added as a method
    handleScroll() {
      // when the user scrolls, check the pageYOffset
      if (window.pageYOffset > 0) {
        // user is scrolled
        if (this.view.atTopOfPage) this.view.atTopOfPage = false;
      } else {
        // user is at top of page
        if (!this.view.atTopOfPage) this.view.atTopOfPage = true;
      }
    },
  },
};
</script>

<style>
</style>
