<template>
  <label :for="id" class="px-2 py-1 text-sm">
    <input
      :id="id"
      v-model="localValue"
      type="checkbox"
      @change="handleChange"
    />
    {{ label }}
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      localValue: this.value,
      id: "_" + Math.random().toString(36).substr(2, 9),
    };
  },
  methods: {
    handleChange(e) {
      this.$emit("input", e.target.checked);
    },
  },
};
</script>

<style></style>
