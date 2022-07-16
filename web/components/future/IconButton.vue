<template>
  <button
    class="mx-2 p-1.5 rounded text-indigo-300 h-8 w-8 hover:text-indigo-400"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    tooltip: {
      type: String,
      default: '',
    },
  },
}
</script>

<style>
</style>