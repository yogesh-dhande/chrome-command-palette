<template>
  <div class="mt-32">
    <div class="mx-2">
      <h3
        class="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl"
      >
        <slot name="header"></slot>
      </h3>
      <div class="mt-3 text-lg text-gray-500">
        <slot name="description"></slot>
      </div>
    </div>

    <div class="mt-8 shadow hover:shadow-xl" aria-hidden="true">
      <slot name="image"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: null,
    },
  },
};
</script>
