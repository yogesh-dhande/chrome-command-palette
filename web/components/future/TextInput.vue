<template>
  <div>
    <label :for="id" class="block text-sm font-medium mt-2 mb-1">
      {{ label }}
    </label>
    <input
      :id="id"
      class="
        shadow-sm
        p-2
        block
        w-full
        text-sm
        bg-gray-800
        border border-gray-500
        rounded-md
      "
      v-model="value"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>
import { useModelWrapper } from "./modelWrapper";

export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      id: "_" + Math.random().toString(36).substr(2, 9),
    };
  },
  setup(props, { emit }) {
    return {
      value: useModelWrapper(props, emit),
    };
  },
};
</script>

<style>
</style>