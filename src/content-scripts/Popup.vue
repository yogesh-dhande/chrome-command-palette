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
        <DialogOverlay
          class="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity"
        />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="ease-out duration-75"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="ease-in duration-75"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
      >
        <Combobox
          as="div"
          id="combo"
          @update:modelValue="(commandResult) => onSelect(commandResult.obj)"
          v-model="selectedCommand"
        >
          <div class="relative">
            <SearchIcon
              class="
                pointer-events-none
                absolute
                top-3.5
                left-4
                h-5
                w-5
                text-gray-500
              "
              aria-hidden="true"
            />
            <ComboboxInput
              id="search"
              placeholder="Search..."
              @change="query = $event.target.value"
              autocomplete="off"
              @keydown.ctrl="selectNth"
              @keydown.ctrl.alt="selectOption"
            />
          </div>

          <ComboboxOptions
            id="options-box"
            v-if="query === '' || filteredCommandResults.length > 0"
            static
            class="
              max-h-96
              scroll-py-2
              divide-y divide-gray-500 divide-opacity-20
              overflow-y-auto
              m-0
            "
          >
            <li class="p-2">
              <ul class="text-sm text-gray-400 m-0">
                <ComboboxOption
                  v-for="(commandResult, i) in query === ''
                    ? recent
                    : filteredCommandResults"
                  :key="i"
                  :value="commandResult"
                  as="template"
                  v-slot="{ active }"
                >
                  <li
                    :class="[
                      'flex flex-col cursor-default select-none rounded-md px-3 py-2',
                      active && 'bg-gray-800 text-white',
                    ]"
                  >
                    <div class="flex">
                      <span
                        class="ml-3 flex-auto truncate"
                        v-html="highlight(commandResult)"
                      ></span>
                      <component
                        :is="getIconNameForCommand(commandResult.obj)"
                        :class="[
                          'h-6 w-6',
                          active ? 'text-white' : 'text-gray-500',
                        ]"
                        aria-hidden="true"
                      />
                    </div>
                    <p
                      v-if="commandResult.obj.type === 'link'"
                      class="text-xs px-3"
                    >
                      {{ commandResult.obj.config.url }}
                    </p>
                    <p></p>
                    <div v-if="active" class="flex flex-row flex-wrap text-sm">
                      <div
                        v-for="(option, i) in getOptions(commandResult.obj)"
                        :key="option.labelText"
                        class="
                          text-sm text-center
                          rounded
                          px-2
                          py-1
                          bg-gray-700
                          hover:bg-gray-600
                          border border-gray-200
                          p-1
                          m-1
                        "
                        @click="() => onSelect(option)"
                      >
                        <span class="border-r text-xs pr-1">
                          ctrl+alt+<span class="font-bold">{{ i + 1 }}</span>
                        </span>
                        <span class="pl-1">{{ option.labelText }}</span>
                      </div>
                    </div>
                    <pre v-if="active && store">{{
                      JSON.stringify(commandResult.obj.config, undefined, 2)
                    }}</pre>
                  </li>
                </ComboboxOption>
              </ul>
            </li>
          </ComboboxOptions>

          <div
            v-if="query !== '' && filteredCommandResults.length === 0"
            class="py-14 px-6 text-center sm:px-14"
          >
            <FolderIcon
              class="mx-auto h-6 w-6 text-gray-500"
              aria-hidden="true"
            />
            <p class="mt-4 text-sm text-gray-200">
              We couldn't find any commands with that term. Please try again.
            </p>
          </div>
        </Combobox>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { computed, ref } from "vue";

import { SearchIcon } from "@heroicons/vue/solid";
import {
  LinkIcon,
  AnnotationIcon,
  CursorClickIcon,
  GlobeAltIcon,
} from "@heroicons/vue/outline";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

import { openUrl, triggerElement, getIconNameForCommand } from "./triggers";
import { go, highlight } from "fuzzysort";

export default {
  props: {
    store: Array,
  },
  components: {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    Dialog,
    DialogOverlay,
    AnnotationIcon,
    CursorClickIcon,
    LinkIcon,
    SearchIcon,
    GlobeAltIcon,
    TransitionChild,
    TransitionRoot,
  },
  setup(props) {
    const recent = props.store.commands[0];
    const visible = ref(false);
    const selectedCommand = ref("");
    const preferences = props.store.preferences;

    const query = ref("");
    const filteredCommandResults = computed(() =>
      go(query.value.toLowerCase(), props.store.commands, {
        key: "labelText",
        limit: 10,
        all: true,
      })
    );

    return {
      visible,
      preferences,
      query,
      recent,
      filteredCommandResults,
      getIconNameForCommand,
      highlight,
      selectedCommand,
    };
  },
  computed: {
    options() {
      return this.getOptions(this.selectedCommand);
    },
  },
  methods: {
    onSelect(command) {
      this.visible = false;
      this.triggerCommand(command);
    },
    selectFirst() {
      if (this.filteredCommandResults.length > 0) {
        this.onSelect(this.filteredCommandResults[0].obj);
      }
    },
    selectNth(evt) {
      if (!evt.shiftKey & !evt.altKey) {
        evt.preventDefault();
        const n = parseInt(evt.key);
        if (n && n < this.filteredCommandResults.length + 1) {
          this.onSelect(this.filteredCommandResults[n - 1].obj);
        }
      }
    },
    triggerCommand(command) {
      if (command.type === "element") {
        // Command is to open a specified link
        triggerElement(command);
      } else if (command.type === "link") {
        // Command is to open a specified link
        openUrl(command.config.url, command.config.target);
      } else if (command.type === "chrome") {
        chrome.runtime.sendMessage({ type: "execute_chrome_command", command });
      }
    },
    highlight(commandResult) {
      return highlight(commandResult, '<span class="text-red-600">', "</span>");
    },
    getOptions(command) {
      this.selectedCommand = command;
      const options = [];
      if (command.type === "element" && command.config.options?.length > 0) {
        command.config.options
          .filter((option) => (option.type = "element"))
          .forEach((option) => {
            const type = option.type;
            const scopeElement = command.scopeElement;
            const config = option[type];
            const labelElement = config.label.selector
              ? scopeElement.querySelector(config.label.selector)
              : scopeElement;

            const labelText = renderTemplateString(
              config.label.template,
              labelElement
            );

            const triggerElement = config.trigger.selector
              ? scopeElement.querySelector(config.trigger.selector)
              : scopeElement;

            if (
              labelText &&
              labelText !== "#" &&
              triggerElement &&
              !isHidden(triggerElement)
            ) {
              options.push({
                type,
                labelText,
                scopeElement,
                triggerElement,
                config,
              });
            }
          });

        // TODO handle options for type = "link" - is that a valid use case?
      } else if (command.type === "link") {
        options.push({
          type: "link",
          labelText: "Open in New Tab",
          config: {
            url: command.config.url,
            label: "Open in New Tab",
            target: "_blank",
          },
        });
      }
      return options;
    },
    selectOption(evt) {
      if (!evt.shiftKey) {
        evt.preventDefault();
        const options = this.getOptions(this.selectedCommand);
        const n = parseInt(evt.key);
        if (n && n < options.length + 1) {
          this.onSelect(options[n - 1]);
        }
      }
    },
  },
};
</script>

<style scoped>
#combo {
  @apply mx-auto
            max-w-2xl
            transform
            divide-y divide-gray-500 divide-opacity-20
            overflow-hidden
            rounded-xl
            bg-gray-900
            shadow-2xl
            transition-all;
}

#search {
  font-size: 16px;
  @apply mx-auto
            max-w-2xl
            transform
            divide-y divide-gray-500 divide-opacity-20
            overflow-hidden
            rounded-xl
            bg-gray-900
            shadow-2xl
            transition-all
                h-12
                w-full
                border-0
                bg-transparent
                pl-11
                pr-4
                text-white
                placeholder-gray-500
                focus:ring-0
                sm:text-sm;
}
#options-box::-webkit-scrollbar {
  background-color: #374151;
  width: 8px;
}

#options-box::-webkit-scrollbar-thumb {
  background-color: #64748b;
}
</style>