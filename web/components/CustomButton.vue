<template>
  <button
    class="
      w-full
      inline-flex
      justify-center
      py-2
      px-4
      border border-transparent
      shadow-sm
      text-md
      font-bold
      rounded-md
      text-white
      hover:text-cyan-50
      bg-gradient-to-r
      from-cyan-600
      to-teal-600
      hover:from-cyan-700 hover:to-teal-700
      focus:ring-4 focus:ring-yellow-200 focus:bg-yellow-700
      disabled:opacity-50
    "
    @click="(e) => $emit('click', e)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "CustomButton",
};
</script>

<style>
</style>