<template>
  <div class="text-gray-100">
    <SelectInput
      label="Command Type"
      v-model="commandType"
      :options="[
        { value: 'element', text: 'HTML Element' },
        { value: 'link', text: 'Go To URL' },
      ]"
    />
    <ElementConfigBuilder
      v-if="commandType === 'element'"
      :modelValue="elementConfig"
      @update:modelValue="elementConfig = $event"
    />

    <LinkConfigBuilder
      v-else
      :modelValue="linkConfig"
      @update:modelValue="linkConfig = $event"
    />
    {{ elementConfig }}
    {{ linkConfig }}
  </div>
</template>

<script>
import SelectInput from "./SelectInput.vue";
import ElementConfigBuilder from "./ElementConfigBuilder.vue";
import LinkConfigBuilder from "./LinkConfigBuilder.vue";
export default {
  components: {
    SelectInput,
    ElementConfigBuilder,
    LinkConfigBuilder,
  },
  props: {
    urlpatternProp: {
      type: String,
      default: null,
    },
    commandTypeProp: {
      type: String,
      default: "element",
    },
  },
  data() {
    return {
      commandType: "element",
      config: {},
      elementConfig: {
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
      },
      linkConfig: { url: "", label: "" },
    };
  },
};
</script>

<style>
</style>