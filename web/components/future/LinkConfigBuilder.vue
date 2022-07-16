<template>
  <div>
    <text-input
      label="URL"
      v-model="url"
      @input="$emit('update:modelValue', outConfig)"
    />
    {{ url }}
    <text-input
      label="Label"
      v-model="label"
      @input="$emit('update:modelValue', outConfig)"
    />
  </div>
</template>

<script>
import TextInput from "./TextInput.vue";

export default {
  components: {
    TextInput,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {
          url: "",
          label: "",
        };
      },
    },
  },
  data() {
    return {
      url: this.modelValue.url,
      label: this.modelValue.label,
    };
  },
  computed: {
    outConfig() {
      return {
        url: this.url,
        label: this.label,
      };
    },
  },
};
</script>

<style>
</style>