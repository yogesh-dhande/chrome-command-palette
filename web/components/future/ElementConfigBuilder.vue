<template>
  <div>
    <text-input
      label="Scope Selector"
      v-model="scopeSelector"
      @input="$emit('update:modelValue', outConfig)"
    />

    <text-input
      label="Label Element Selector"
      v-model="labelElementSelector"
      @input="$emit('update:modelValue', outConfig)"
    />
    <text-input
      label="Label Template"
      v-model="labelTemplate"
      @input="$emit('update:modelValue', outConfig)"
    />

    <text-input
      label="Trigger Element Selector"
      v-model="triggerElementSelector"
      @input="$emit('update:modelValue', outConfig)"
    />
    <SelectInput
      label="Trigger Type"
      v-model="triggerType"
      :options="[
        { value: 'click', text: 'Click' },
        { value: 'open', text: 'Open a Link' },
        { value: 'focus', text: 'Focus' },
        { value: 'simulatedClick', text: 'MouseOver -> MouseDown -> MouseUp' },
      ]"
      @change="$emit('update:modelValue', outConfig)"
    />
  </div>
</template>

<script>
import TextInput from "./TextInput.vue";
import SelectInput from "./SelectInput.vue";

export default {
  components: {
    TextInput,
    SelectInput,
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          scope: {
            selector: "button",
          },
          label: {
            selector: "",
            template: "",
          },
          trigger: {
            selector: "",
            type: "click",
          },
        };
      },
    },
  },
  data() {
    return {
      scopeSelector: this.config.scope.selector,
      labelElementSelector: this.config.label.selector,
      labelTemplate: this.config.labelTemplate,
      triggerElementSelector: this.config.triggerElementSelector,
      triggerType: this.config.triggerType,
    };
  },
  computed: {
    outConfig() {
      return {
        scope: {
          selector: this.scopeSelector,
        },
        label: {
          selector: this.labelElementSelector,
          template: this.labelTemplate,
        },
        trigger: {
          selector: this.triggerElementSelector,
          type: this.triggerType,
        },
      };
    },
  },
};
</script>

<style>
</style>