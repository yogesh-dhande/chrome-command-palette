<template>
  <div class="
              sd-mx-auto
              sd-text-gray-100
              sd-max-w-2xl
              sd-transform
              sd-divide-y
              sd-divide-gray-500
              sd-divide-opacity-20
              sd-overflow-hidden
              sd-rounded-xl
              sd-shadow-2xl
              sd-transition-all
            "><CommandPalette /></div>
</template>

<script setup>
import "../styles/main.css";
import CommandPalette from "../content-scripts/components/CommandPalette.vue"
import { store } from "../content-scripts/store";
import { categories } from "../content-scripts/commands";
store.commands = [
        {
          type: "chrome",

          label: `Tabs: Split tab to right`,
          config: {
            name: "splitTab",
            side: "right",
          },
          categories: [categories.ALL, categories.TABS],
        },
      ]

store.currentUser = {
    preferences: {
      debug: false,
      showAllTab: true,
      categoriesInAllTab: [
        categories.PAGE,
        categories.TABS,
        categories.BOOKMARKS,
      ],
      additionalCategories: [
        categories.PAGE,
        categories.TABS,
        categories.BOOKMARKS,
      ],
    },
  }
</script>