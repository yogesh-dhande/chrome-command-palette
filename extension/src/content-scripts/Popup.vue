<template>
  <TransitionRoot :show="visible" as="template" @after-leave="query = ''">
    <Dialog
      as="div"
      class="
        sd-font-sans sd-fixed sd-inset-0 sd-z-[10000] sd-overflow-y-auto sd-p-4
        sm:sd-p-6
        md:sd-p-20
        sd-mt-24
      "
      :class="{ 'sd-z-0': !visible }"
      @close="visible = false"
    >
      <TransitionChild
        as="template"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="
            sd-fixed
            sd-inset-0
            sd-bg-gray-500
            sd-bg-opacity-25
            sd-transition-opacity
          "
        />
      </TransitionChild>

      <div
        class="
          sd-fixed sd-inset-0 sd-z-10 sd-overflow-y-auto sd-p-4
          sm:sd-p-6
          md:sd-p-20
        "
      >
        <TransitionChild
          as="template"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="
              sd-mx-auto
              sd-text-gray-100
              sd-max-w-2xl
              sd-transform
              sd-divide-y
              sd-divide-gray-500
              sd-divide-opacity-20
              sd-overflow-hidden
              sd-rounded-xl
              sd-bg-gray-900
              sd-shadow-2xl
              sd-transition-all
            "
          >
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
</style>