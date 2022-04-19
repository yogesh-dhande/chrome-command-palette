<template>
  <TransitionRoot :show="open" as="template" @after-leave="query = ''">
    <Dialog
      as="div"
      class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20 mt-24"
      @close="open = false"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <DialogOverlay
          class="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity"
        />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="ease-in duration-200"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
      >
        <Combobox
          as="div"
          class="
            mx-auto
            max-w-2xl
            transform
            divide-y divide-gray-500 divide-opacity-20
            overflow-hidden
            rounded-xl
            bg-gray-900
            shadow-2xl
            transition-all
          "
          @update:modelValue="onSelect"
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
              class="
                h-12
                w-full
                border-0
                bg-transparent
                pl-11
                pr-4
                text-white
                placeholder-gray-500
                focus:ring-0
                sm:text-sm
              "
              placeholder="Search..."
              @change="query = $event.target.value"
              autocomplete="off"
            />
          </div>

          <ComboboxOptions
            v-if="query === '' || filteredCommands.length > 0"
            static
            class="
              max-h-80
              scroll-py-2
              divide-y divide-gray-500 divide-opacity-20
              overflow-y-auto
            "
          >
            <li class="p-2">
              <h2
                v-if="query === ''"
                class="mt-4 mb-2 px-3 text-xs font-semibold text-gray-200"
              >
                Recent searches
              </h2>
              <ul class="text-sm text-gray-400">
                <ComboboxOption
                  v-for="(command, i) in query === ''
                    ? recent
                    : filteredCommands"
                  :key="i"
                  :value="command"
                  as="template"
                  v-slot="{ active }"
                >
                  <li
                    :class="[
                      'flex cursor-default select-none items-center rounded-md px-3 py-2',
                      active && 'bg-gray-800 text-white',
                    ]"
                  >
                    <component
                      :is="getIconNameForTriggerType(command.triggerType)"
                      :class="[
                        'h-6 w-6 flex-none',
                        active ? 'text-white' : 'text-gray-500',
                      ]"
                      aria-hidden="true"
                    />
                    <span class="ml-3 flex-auto truncate">{{
                      command.label
                    }}</span>
                    <span v-if="active" class="ml-3 flex-none text-gray-400"
                      >{{ command.triggerType }}...</span
                    >
                  </li>
                </ComboboxOption>
              </ul>
            </li>
            <li v-if="query === ''" class="p-2">
              <h2 class="sr-only">Quick actions</h2>
              <ul class="text-sm text-gray-400">
                <ComboboxOption
                  v-for="action in quickActions"
                  :key="action.shortcut"
                  :value="action"
                  as="template"
                  v-slot="{ active }"
                >
                  <li
                    :class="[
                      'flex cursor-default select-none items-center rounded-md px-3 py-2',
                      active && 'bg-gray-800 text-white',
                    ]"
                  >
                    <component
                      :is="action.icon"
                      :class="[
                        'h-6 w-6 flex-none',
                        active ? 'text-white' : 'text-gray-500',
                      ]"
                      aria-hidden="true"
                    />
                    <span class="ml-3 flex-auto truncate">{{
                      action.name
                    }}</span>
                    <span
                      class="ml-3 flex-none text-xs font-semibold text-gray-400"
                    >
                      <kbd class="font-sans">⌘</kbd>
                      <kbd class="font-sans">{{ action.shortcut }}</kbd>
                    </span>
                  </li>
                </ComboboxOption>
              </ul>
            </li>
          </ComboboxOptions>

          <div
            v-if="query !== '' && filteredCommands.length === 0"
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
import { computed, ref, onMounted, reactive, toRefs } from "vue";
import { SearchIcon } from "@heroicons/vue/solid";
import {
  DocumentAddIcon,
  ExternalLinkIcon,
  AnnotationIcon,
  CursorClickIcon,
  FolderAddIcon,
  HashtagIcon,
  TagIcon,
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

const quickActions = [
  { name: "Add new file...", icon: DocumentAddIcon, shortcut: "N", url: "#" },
  { name: "Add new folder...", icon: FolderAddIcon, shortcut: "F", url: "#" },
  { name: "Add hashtag...", icon: HashtagIcon, shortcut: "H", url: "#" },
  { name: "Add label...", icon: TagIcon, shortcut: "L", url: "#" },
];

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
    ExternalLinkIcon,
    SearchIcon,
    TransitionChild,
    TransitionRoot,
  },
  setup(props) {
    const recent = props.store.commands[0];
    const open = ref(false);
    const state = reactive({
      currentTab: null,
    });
    onMounted(() => {
      chrome.runtime.sendMessage({ type: "POPUP_INIT" });
    });

    const query = ref("");
    const filteredCommands = computed(() =>
      query.value === ""
        ? []
        : props.store.commands.filter((command) => {
            return command.label
              .toLowerCase()
              .includes(query.value.toLowerCase());
          })
    );

    return {
      open,
      ...toRefs(state),
      query,
      recent,
      quickActions,
      filteredCommands,
      onSelect(command) {
        console.log(command);
        const triggerElement = command.triggerElementSelector
          ? command.scope.querySelector(command.triggerElementSelector)
          : command.scope;

        console.log(triggerElement);
        if (command.triggerType === "click") {
          triggerElement.click();
        } else if (command.triggerType === "open") {
          window.open(
            triggerElement.href,
            triggerElement.target ? triggerElement.target : "_self"
          );
        } else if (command.triggerType === "focus") {
          triggerElement.focus();
        }
      },
      getIconNameForTriggerType(triggerType) {
        if (triggerType === "click") {
          return "CursorClickIcon";
        } else if (triggerType === "open") {
          return "ExternalLinkIcon";
        } else if (triggerType === "focus") {
          return "AnnotationIcon";
        }
      },
    };
  },
};
</script>