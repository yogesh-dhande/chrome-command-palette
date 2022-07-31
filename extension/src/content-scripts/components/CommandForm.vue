<template>
  <div class="sd-px-6 sd-py-8">
    <h2 class="sd-text-lg sd-mx-2">{{ title }}</h2>
    <div
      id="command-form"
      v-for="field in formFields"
      :key="field.name"
      class="sd-mt-3 sd-text-sm"
    >
      <label :for="field.name" class="sd-text-gray-200 sd-mx-2">{{
        field.name
      }}</label>
      <input
        :id="field.name"
        type="text"
        v-model="field.value"
        @keydown.enter="handleInput"
        class="
          sd-transform
          sd-bg-gray-800
          sd-shadow-2xl
          sd-transition-all
          sd-w-full
          sd-border-0
          sd-m-0
          sd-py-2
          sd-px-3
          rounded
          sd-text-gray-200 sd-placeholder-gray-500
          focus:sd-ring-0 focus:sd-outline-none
          sm:sd-text-sm;
        "
      />
    </div>
    <button v-if="formFields.length > 1" @click="handleSubmit">Run</button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps({
  form: Object,
  title: String,
});

const formFields = Object.keys(props.form).map((name) => {
  const field = props.form[name];
  return {
    name,
    type: field.type,
    value: field.default,
  };
});

onMounted(() => {
  document.getElementById(formFields[0].name).select();
});

const emit = defineEmits(["submit"]);

function handleInput() {
  // if only one field, no submit button is shown
  if (formFields.length === 1) {
    emit(
      "submit",
      formFields.reduce(function (acc, cur) {
        acc[cur.name] = cur.value;
        return acc;
      }, {})
    );
  }
}

function handleSubmit() {
  emit(
    "submit",
    formFields.reduce(function (acc, cur) {
      acc[cur.name] = cur.value;
      return acc;
    }, {})
  );
}
</script>
