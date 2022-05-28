<template>
  <div>
    <label for="about" class="block text-sm font-medium text-cyan-50 mt-2 mb-0">
      {{ label }}
    </label>
    <div class="mt-1">
      <input
        required
        type="password"
        autocomplete="current-password"
        rows="3"
        class="
          shadow-sm
          focus:ring-gray-500 focus:border-gray-500
          mt-1
          p-2
          block
          w-full
          text-sm
          bg-gray-800
          rounded-md
        "
        v-model="value"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
    </div>
  </div>
</template>

<script>
import { useModelWrapper } from "./modelWrapper";

export default {
  name: "password-input",
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
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