<template>
  <div>
    <div v-if="form">
      <CommandForm
        @submit="handleFormSubmit"
        :form="form"
        :title="activeCommand.label"
      ></CommandForm>
    </div>
    <Combobox v-else as="div">
      <div
        class="
          sd-flex
          sd-text-xs
          sd-mt-1
          sd-items-center
          sd-px-6
          sd-py-6
          sd-justify-between
        "
      >
        <div class="sd-flex sd-items-center sd-space-x-2">
          <img
            :src="logoUrl"
            alt="logo"
            class="sd-w-12 sd-h-12 sd-inline sd-mx-2"
          />
          <div v-for="category in tabCategories" :key="category">
            <input
              type="radio"
              :id="`category-${category}`"
              :value="category"
              v-model="selectedCategory"
              class="sd-hidden"
            />
            <label
              :for="`category-${category}`"
              :class="[
                'sd-px-2 sd-py-1 hover:sd-bg-gray-600 sd-rounded-md sd-text-white sd-text-sm',
                selectedCategory === category &&
                  'sd-bg-gray-700 sd-text-cyan-300',
              ]"
              >{{ category }}</label
            >
          </div>
        </div>
        <a
          href="https://blog.singledispatch.com/feedback"
          target="_blank"
          class="sd-text-cyan-300 sd-underline"
          tabindex="-1"
          >Send feedback</a
        >
      </div>
      <input
        id="search"
        placeholder="Search..."
        @input="query = $event.target.value"
        autocomplete="off"
        @keydown="handleKeys"
        @keydown.right="selectNextCategory"
        @keydown.left="selectPreviousCategory"
        @keydown.enter="triggerActiveCommand"
        @keydown.esc="$emit('close')"
        @keydown.down="selectNextActiveCommand"
        @keydown.up="selectPreviousActiveCommand"
      />
      <div class="sd-mx-6">
        <button
          v-if="query"
          tabindex="-1"
          @click="search"
          class="
            sd-bg-gray-900
            sd-border-none
            sd-text-gray-100
            sd-text-xs
            sd-select-none
            sd-rounded-md
            sd-px-2
            sd-py-1
          "
        >
          <span class="sd-border-r sd-pr-1 sd-mr-1">ctrl+alt+s</span>Search in
          New Tab
        </button>
      </div>

      <ComboboxOptions
        id="options-box"
        v-if="query === '' || filteredCommandResults.length > 0"
        static
      >
        <li class="sd-p-2">
          <ul class="sd-text-sm sd-text-gray-200 sd-m-0 sd-p-0 sd-list-none">
            <ComboboxOption
              v-for="(commandResult, i) in filteredCommandResults"
              :key="i"
              :id="commandResult.obj.label"
              :value="commandResult.obj"
              as="template"
            >
              <li
                :class="[
                  'sd-flex sd-flex-col sd-cursor-default sd-select-none sd-rounded-md sd-px-3 sd-py-2',
                  activeCommandIndex === i && 'sd-bg-gray-700 sd-text-white',
                ]"
                @click="triggerActiveCommand"
              >
                <div class="sd-flex sd-justify-between">
                  <div
                    class="sd-overflow-hidden sd-max-w-2xl sd-whitespace-nowrap"
                  >
                    <p
                      class="sd-m-0 sd-text-gray-200 sd-text-sm"
                      v-html="highlight(commandResult)"
                    ></p>
                    <p
                      v-if="commandResult.obj.config.url"
                      class="sd-text-xs sd-m-0 sd-text-gray-200"
                    >
                      {{ commandResult.obj.config.url.substring(0, 120) }}
                    </p>
                  </div>

                  <component
                    :is="getIconNameForCommand(commandResult.obj)"
                    :class="[
                      'sd-h-4 sd-w-4 sd-inline',
                      activeCommandIndex === i
                        ? 'sd-text-cyan-300'
                        : 'sd-text-gray-200',
                    ]"
                    aria-hidden="true"
                  />
                </div>

                <div
                  v-if="activeCommandIndex === i"
                  class="sd-flex sd-flex-row sd-flex-wrap sd-text-sm"
                >
                  <div
                    v-for="(option, i) in getOptions(commandResult.obj)"
                    :key="option.label"
                    class="
                      sd-text-xs
                      sd-text-center
                      sd-rounded-md
                      sd-px-2
                      sd-py-1
                      sd-bg-gray-800
                      hover:sd-bg-gray-700 hover:sd-text-cyan-300
                      sd-border sd-border-gray-100
                      hover:sd-border-cyan-300
                      sd-m-1
                    "
                    @click="() => onSelect(option)"
                  >
                    <span class="sd-border-r sd-pr-1">
                      ctrl+alt+{{ i + 1 }}
                    </span>
                    <span class="sd-pl-1">{{ option.label }}</span>
                  </div>
                </div>
                <pre v-if="activeCommandIndex === i && preferences.debug">{{
                  JSON.stringify(commandResult.obj.config, undefined, 2)
                }}</pre>
              </li>
            </ComboboxOption>
          </ul>
        </li>
      </ComboboxOptions>

      <div
        v-if="query !== '' && filteredCommandResults.length === 0"
        class="sd-py-14 sd-px-6 sd-text-center sm:sd-px-14"
      >
        <div class="sd-mt-4 sd-text-sm sd-text-gray-200">
          We couldn't find any commands with that term. Please try again.
        </div>
      </div>
    </Combobox>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
} from "@headlessui/vue";
import { SearchIcon } from "@heroicons/vue/solid";
import {
  LinkIcon,
  AnnotationIcon,
  CursorClickIcon,
  GlobeAltIcon,
} from "@heroicons/vue/outline";
import CommandForm from "./CommandForm.vue";

import {
  openUrl,
  triggerElementCommand,
  getIconNameForCommand,
} from "@/content-scripts/triggers";
import { getCommandFromScope, categories } from "@/content-scripts/commands";
import { go, highlight } from "fuzzysort";

import { store } from "@/content-scripts/store";

export default {
  components: {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    ComboboxButton,
    AnnotationIcon,
    CursorClickIcon,
    LinkIcon,
    SearchIcon,
    GlobeAltIcon,
    CommandForm,
  },
  setup() {
    const recent = ref(store.commands.length > 0 ? store.commands[0] : null);
    const form = ref(null);
    const preferences = store.currentUser.preferences;

    let tabCategories = preferences.additionalCategories;
    if (preferences.showAllTab) {
      tabCategories = [categories.ALL].concat(preferences.additionalCategories);
    }
    const selectedCategory = ref(tabCategories[0]);

    const query = ref("");

    const activeCommandIndex = ref(0);
    const activeCommand = ref(
      store.commands.length > 0 ? store.commands[0] : null
    );

    const filteredCommandResults = computed(() => {
      const categorizedCommands = store.commands.filter((command) => {
        if (selectedCategory.value === categories.ALL) {
          return command.categories.some((element) =>
            preferences.categoriesInAllTab.includes(element)
          );
        }
        return command.categories.includes(selectedCategory.value);
      });

      const results = go(query.value.toLowerCase(), categorizedCommands, {
        key: "label",
        limit: 10,
        all: true,
      });
      if (results.length === 0) {
        activeCommandIndex.value = null;
        activeCommand.value = null;
      } else {
        activeCommandIndex.value = 0;
        activeCommand.value = results[0].obj;
      }

      return results;
    });

    return {
      form,
      tabCategories,
      selectedCategory,
      preferences,
      query,
      recent,
      filteredCommandResults,
      getIconNameForCommand,
      highlight,
      activeCommandIndex,
      activeCommand,
      logoUrl: chrome.runtime.getURL("assets/128x128.png"),
    };
  },
  watch: {
    activeCommand(newValue) {
      // set the scroll position to always keep active command in view
      if (!newValue || this.activeCommandIndex === 0) {
        const optionsBox = document.getElementById("options-box");
        if (optionsBox) {
          optionsBox.scrollTop = 0;
        }
      } else {
        document.getElementById(newValue.label)?.scrollIntoView();
      }
    },
  },
  methods: {
    handleKeys(evt) {
      // alt tab is the way to tab through categories when an option was selected
      if (evt.code === "Tab" && !evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
        this.selectNextCategory(evt);
      } else if (
        evt.code === "Tab" &&
        !evt.ctrlKey &&
        evt.shiftKey &&
        !evt.altKey
      ) {
        this.selectPreviousCategory(evt);
      }
      // TODO use preferences to match
      else if (evt.ctrlKey && evt.shiftKey && !evt.altKey) {
        this.selectNth(evt);
      } else if (evt.ctrlKey && !evt.shiftKey && evt.altKey) {
        if (evt.code == "KeyS") {
          this.search();
        } else {
          this.selectOption(evt);
        }
      }
    },
    selectNextCategory(evt) {
      evt.preventDefault();
      const index = this.tabCategories.findIndex(
        (cat) => cat === this.selectedCategory
      );
      if (index + 1 === this.tabCategories.length) {
        this.selectedCategory = this.tabCategories[0];
      } else {
        this.selectedCategory = this.tabCategories[index + 1];
      }
    },
    selectPreviousCategory(evt) {
      evt.preventDefault();
      const index = this.tabCategories.findIndex(
        (cat) => cat === this.selectedCategory
      );
      if (index === 0) {
        this.selectedCategory =
          this.tabCategories[this.tabCategories.length - 1];
      } else {
        this.selectedCategory = this.tabCategories[index - 1];
      }
    },
    async search() {
      await chrome.runtime.sendMessage({ type: "search", query: this.query });
    },
    selectNextActiveCommand(evt) {
      evt.preventDefault();
      if (this.activeCommandIndex + 1 === this.filteredCommandResults.length) {
        this.activeCommandIndex = 0;
      } else {
        this.activeCommandIndex += 1;
      }
      this.activeCommand =
        this.filteredCommandResults[this.activeCommandIndex].obj;
    },
    selectPreviousActiveCommand(evt) {
      evt.preventDefault();
      if (this.activeCommandIndex === 0) {
        this.activeCommandIndex = this.filteredCommandResults.length - 1;
      } else {
        this.activeCommandIndex -= 1;
      }
      this.activeCommand =
        this.filteredCommandResults[this.activeCommandIndex].obj;
    },
    onSelect(command) {
      if (command.config?.form) {
        this.form = command.config?.form;
      }
      if (!this.form) {
        this.$emit("close");
        this.triggerCommand(command);
      }
      // reset category
      this.selectedCategory = categories[0];
    },
    triggerActiveCommand() {
      if (this.activeCommand) {
        this.onSelect(this.activeCommand);
      }
    },
    selectFirst() {
      if (this.filteredCommandResults.length > 0) {
        this.onSelect(this.filteredCommandResults[0].obj);
      }
    },
    selectNth(evt) {
      const n = parseInt(evt.key);
      if (n && n < this.filteredCommandResults.length + 1) {
        evt.preventDefault();
        this.onSelect(this.filteredCommandResults[n - 1].obj);
      }
    },
    triggerCommand(command) {
      if (command.type === "element") {
        triggerElementCommand(command);
      } else if (command.type === "link") {
        openUrl(command);
      } else if (command.type === "chrome") {
        chrome.runtime.sendMessage({ type: "execute_chrome_command", command });
      } else if (command.type === "callback") {
        command.callback();
      }
    },
    async handleFormSubmit(formData) {
      this.activeCommand.config.form = formData;
      this.triggerCommand(this.activeCommand);
      this.$emit("close");
      this.form = null;
    },
    highlight(commandResult) {
      if (this.query) {
        return highlight(
          commandResult,
          '<span class="sd-text-cyan-300 sd-font-bold">',
          "</span>"
        );
      }
      return commandResult.obj.label;
    },
    getOptions(command) {
      const options = [];
      if (command.type === "element" && command.config.options?.length > 0) {
        command.config.options
          .filter((option) => (option.type = "element"))
          .forEach((option) => {
            const type = option.type;
            const scopeElement = command.scopeElement;
            const config = option[type];
            const commandOption = getCommandFromScope(
              scopeElement,
              type,
              config
            );
            if (commandOption) options.push(commandOption);
          });

        // TODO add option to open in new window
      } else if (command.type === "link") {
        options.push({
          type: "link",
          label: "Open in New Tab",
          config: {
            url: command.config.url,
            label: "Open in New Tab",
            target: "_blank",
          },
        });
      } else if (command.type === "chrome" && command.options) {
        return command.options;
      }
      return options;
    },
    selectOption(evt) {
      if (this.activeCommand) {
        const options = this.getOptions(this.activeCommand);
        const n = parseInt(evt.key);
        if (n && n < options.length + 1) {
          evt.preventDefault();
          this.onSelect(options[n - 1]);
        }
      }
    },
  },
};
</script>

<style scoped>
.glow {
  box-shadow: 0 0 20px #2f7083;
}

#search {
  font-size: 16px;
  @apply sd-transform
    sd-divide-y sd-divide-gray-500 sd-divide-opacity-20
    sd-overflow-hidden
    sd-rounded-xl
    sd-shadow-2xl
    sd-transition-all
    sd-h-12
    sd-w-full
    sd-border-0
    sd-bg-transparent
    sd-m-0 sd-py-0
    sd-px-8
    sd-text-white
    sd-placeholder-gray-500
    focus:sd-ring-0
    focus:sd-outline-none
    sm:sd-text-sm;
}

#options-box {
  @apply sd-overflow-auto
          sd-max-h-96
          sd-scroll-py-2
          sd-divide-y sd-divide-gray-500 sd-divide-opacity-20
          sd-my-0
          sd-mx-2
          sd-p-0
          sd-list-none;
}

#options-box::-webkit-scrollbar {
  background-color: #374151;
  width: 8px;
}

#options-box::-webkit-scrollbar-thumb {
  background-color: #64748b;
}
</style>