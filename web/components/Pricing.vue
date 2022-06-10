<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div
    class="mx-auto bg-gray-900 rounded-lg flex-col border border-gray-500 mt-3"
  >
    <div class="flex-1 px-6 py-4 lg:py-8">
      <h3 class="text-2xl font-extrabold text-gray-200 sm:text-3xl">
        Annual Subscription
      </h3>
      <div class="mt-4">
        <div class="flex items-center">
          <h4
            class="
              flex-shrink-0
              rounded
              pl-2
              pr-6
              py-1
              bg-gray-700
              text-sm
              tracking-wider
              font-semibold
              uppercase
              text-gray-100
            "
          >
            What's included
          </h4>
          <div class="flex-1 border-t-2 border-gray-200" />
        </div>
        <ul role="list" class="mt-8 space-y-5">
          <li
            v-for="feature in includedFeatures"
            :key="feature"
            class="flex items-start lg:col-span-1"
          >
            <div class="flex-shrink-0">
              <CheckCircleIcon
                class="h-5 w-5 text-cyan-500"
                aria-hidden="true"
              />
            </div>
            <p class="ml-3 text-sm text-gray-300">
              {{ feature }}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="py-2 px-6 text-center bg-gray-50 rounded-lg">
      <div
        class="
          mt-4
          flex
          items-center
          justify-center
          text-5xl
          font-extrabold
          text-gray-900
        "
      >
        <span> $25 </span>
        <span class="ml-3 mt-3 text-xl font-medium text-gray-500">
          / year
        </span>
      </div>
      <div class="mt-6">
        <div class="rounded-md shadow">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleIcon } from "@heroicons/vue/solid";
import { useStore } from "@/store";

const includedFeatures = [
  "On-page navigation",
  "Tabs and windows Navigation",
  "Bookmarks",
  "Search",
];
</script>