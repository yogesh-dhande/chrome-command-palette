<template>
  <TransitionRoot :show="visible" as="template" @after-leave="query = ''">
    <Dialog
      as="div"
      class="fixed inset-0 z-[100] overflow-y-auto p-4 sm:p-6 md:p-20 mt-24"
      :class="{ 'z-0': !visible }"
      @close="visible = false"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-75"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-75"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
        <TransitionChild
          as="template"
          enter="ease-out duration-75"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-75"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="dialog-root">
            <!-- <Login v-if="!store.isLoggedIn" @close="visible = false" /> -->
            <CommandPalette @close="visible = false" />
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import "@/styles/main.css";
import { ref } from "vue";

import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

import Login from "./components/Login.vue";
import CommandPalette from "./components/CommandPalette.vue";

import { store } from "@/content-scripts/store";

export default {
  components: {
    CommandPalette,
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    Login,
  },
  setup() {
    const visible = ref(false);
    return {
      visible,
      store,
    };
  },
};
</script>

<style scoped>
.dialog-root {
  @apply mx-auto text-gray-100
            max-w-2xl
            transform
            divide-y divide-gray-500 divide-opacity-20
            overflow-hidden
            rounded-xl
            bg-gray-900
            shadow-2xl
            transition-all;
}
</style>