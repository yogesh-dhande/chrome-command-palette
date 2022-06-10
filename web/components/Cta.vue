<template>
  <div class="bg-white">
    <div
      class="
        max-w-7xl
        mx-auto
        py-12
        px-4
        sm:px-6
        lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between
      "
    >
      <h2
        class="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl"
      >
        <span class="block">Join Our Beta</span>
        <span class="block text-cyan-600">Lock in early-adopter pricing!</span>
      </h2>
      <div class="mt-4 lg:flex lg:flex-col lg:mt-0">
        <div class="my-4 text-5xl px-4 font-extrabold text-gray-900">
          <span> $25 </span>
          <span class="mt-3 text-xl font-medium text-gray-500"> / year </span>
        </div>
        <nuxt-link
          to="/login"
          class="
            px-10
            py-3
            border border-transparent
            text-center text-lg
            sm:text-xl
            font-medium
            rounded-md
            bg-gradient-to-r
            from-cyan-500
            to-teal-500
            hover:from-cyan-600 hover:to-teal-600
            focus:ring-4 focus:ring-cyan-200 focus:bg-cyan-700
          "
        >
          Get access
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>