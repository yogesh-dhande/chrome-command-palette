<template>
  <Combobox as="div">
    <div class="flex space-x-2 text-xs mt-1 items-center px-6 py-6">
      <img :src="logoUrl" alt="logo" class="w-12 h-12 inline mx-2" />
      <div v-for="category in categories" :key="category">
        <input
          type="radio"
          :id="`category-${category}`"
          :value="category"
          v-model="selectedCategory"
          class="hidden"
        />
        <label
          :for="`category-${category}`"
          :class="[
            'px-2 py-1 hover:bg-gray-600 rounded-md text-white text-sm',
            selectedCategory === category && 'bg-gray-700 text-cyan-300',
          ]"
          >{{ category }}</label
        >
      </div>
    </div>
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
    </div>
    <div class="mx-6">
      <button
        v-if="query"
        tabindex="-1"
        @click="search"
        class="text-gray-100 text-xs select-none rounded-md px-2 py-1"
      >
        <span class="border-r pr-1 mr-1">ctrl+alt+s</span>Search in New Tab
      </button>
    </div>

    <ComboboxOptions
      id="options-box"
      v-if="query === '' || filteredCommandResults.length > 0"
      static
    >
      <li class="p-2">
        <ul class="text-sm text-gray-200 m-0 p-0">
          <ComboboxOption
            v-for="(commandResult, i) in filteredCommandResults"
            :key="i"
            :value="commandResult.obj"
            as="template"
          >
            <li
              :class="[
                'flex flex-col cursor-default select-none rounded-md px-3 py-2',
                activeCommandIndex === i && 'bg-gray-700 text-white',
              ]"
              @click="triggerActiveCommand"
            >
              <div class="flex justify-between">
                <div>
                  <div class="my-0" v-html="highlight(commandResult)"></div>
                  <div
                    v-if="commandResult.obj.type === 'link'"
                    class="text-xs m-0"
                  >
                    {{ commandResult.obj.config.url.substring(0, 80) }}
                  </div>
                </div>

                <component
                  :is="getIconNameForCommand(commandResult.obj)"
                  :class="[
                    'h-4 w-4 inline',
                    activeCommandIndex === i ? 'text-cyan-300' : 'text-white',
                  ]"
                  aria-hidden="true"
                />
              </div>

              <div
                v-if="activeCommandIndex === i"
                class="flex flex-row flex-wrap text-sm"
              >
                <div
                  v-for="(option, i) in getOptions(commandResult.obj)"
                  :key="option.label"
                  class="
                    text-xs text-center
                    rounded-md
                    px-2
                    py-1
                    bg-gray-800
                    hover:bg-gray-700 hover:text-cyan-300
                    border border-gray-100
                    hover:border-cyan-300
                    m-1
                  "
                  @click="() => onSelect(option)"
                >
                  <span class="border-r pr-1"> ctrl+alt+{{ i + 1 }} </span>
                  <span class="pl-1">{{ option.label }}</span>
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
      class="py-14 px-6 text-center sm:px-14"
    >
      <div class="mt-4 text-sm text-gray-200">
        We couldn't find any commands with that term. Please try again.
      </div>
    </div>
  </Combobox>
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
  },
  setup() {
    const recent = ref(store.commands.length > 0 ? store.commands[0] : null);

    const preferences = store.preferences;
    const allCategories = [
      categories.PAGE,
      categories.TABS,
      categories.BOOKMARKS,
      categories.TOP_SITES,
    ];
    const selectedCategory = ref(allCategories[0]);

    const query = ref("");

    const activeCommandIndex = ref(0);
    const activeCommand = ref(
      store.commands.length > 0 ? store.commands[0] : null
    );

    const filteredCommandResults = computed(() => {
      let kw = query.value.toLowerCase();
      const categorizedCommands = store.commands.filter((command) =>
        command.categories.includes(selectedCategory.value)
      );

      const results = go(kw, categorizedCommands, {
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
      categories: allCategories,
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
      const index = this.categories.findIndex(
        (cat) => cat === this.selectedCategory
      );
      if (index + 1 === this.categories.length) {
        this.selectedCategory = this.categories[0];
      } else {
        this.selectedCategory = this.categories[index + 1];
      }
    },
    selectPreviousCategory(evt) {
      evt.preventDefault();
      const index = this.categories.findIndex(
        (cat) => cat === this.selectedCategory
      );
      if (index === 0) {
        this.selectedCategory = this.categories[this.categories.length - 1];
      } else {
        this.selectedCategory = this.categories[index - 1];
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
      this.$emit("close");
      this.triggerCommand(command);
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
    highlight(commandResult) {
      if (this.query) {
        return highlight(
          commandResult,
          '<span class="text-cyan-300 font-bold">',
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
    m-0 py-0
    pl-11
    pr-4
    text-white
    placeholder-gray-500
    focus:ring-0
    focus:outline-none
    sm:text-sm;
}

#options-box {
  @apply max-h-96
    scroll-py-2
    divide-y divide-gray-500 divide-opacity-20
    overflow-y-auto
    my-0
    mx-2
    truncate
    p-0;
}

#options-box::-webkit-scrollbar {
  background-color: #374151;
  width: 8px;
}

#options-box::-webkit-scrollbar-thumb {
  background-color: #64748b;
}
</style>