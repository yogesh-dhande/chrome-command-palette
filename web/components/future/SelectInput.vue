<template>
  <div>
    <label for="location" class="block text-sm font-medium mt-2 mb-1">{{
      label
    }}</label>
    <select
      id="location"
      name="location"
      v-model="value"
      class="
        mt-1
        block
        w-full
        pl-3
        pr-10
        py-2
        text-base
        bg-gray-800
        sm:text-sm
        rounded-md
        border border-gray-500
      "
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
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
    options: {
      type: Array,
      default: () => [],
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