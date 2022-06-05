<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="bg-gray-100">
    <div class="mt-8 bg-gray-900 pb-16 sm:mt-12 sm:pb-20 lg:pb-28">
      <div class="relative">
        <div class="absolute inset-0 h-1/2 bg-gray-100" />
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            class="
              max-w-lg
              mx-auto
              rounded-lg
              shadow-lg
              overflow-hidden
              lg:max-w-none lg:flex
            "
          >
            <div class="flex-1 bg-white px-6 py-8 lg:p-12">
              <h3 class="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Annual Subscription
              </h3>
              <div class="mt-8">
                <div class="flex items-center">
                  <h4
                    class="
                      flex-shrink-0
                      pr-4
                      bg-white
                      text-sm
                      tracking-wider
                      font-semibold
                      uppercase
                      text-cyan-600
                    "
                  >
                    What's included
                  </h4>
                  <div class="flex-1 border-t-2 border-gray-200" />
                </div>
                <ul
                  role="list"
                  class="
                    mt-8
                    space-y-5
                    lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5
                  "
                >
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
                    <p class="ml-3 text-sm text-gray-700">
                      {{ feature }}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="
                py-8
                px-6
                text-center
                bg-gray-50
                lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12
              "
            >
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
                <span class="ml-3 text-xl font-medium text-gray-500">
                  / year
                </span>
              </div>
              <div class="mt-6">
                <div class="rounded-md shadow">
                  <Submit @click="selectPlan" label="Get Access" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { CheckCircleIcon } from "@heroicons/vue/solid";
import { useStore } from "@/store";

const includedFeatures = [
  "On-page navigation",
  "Tabs and windows Navigation",
  "Bookmarks",
  "Search",
];

const { $analytics } = useNuxtApp();
const router = useRouter();
const store = useStore();

const config = useRuntimeConfig().public;

async function selectPlan() {
  console.log(store.loggedIn, store.isPaidAccount);
  if (store.loggedIn && !store.isPaidAccount) {
    openCheckout();
  } else {
    router.push("/register");
  }
}
function openCheckout() {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-undef
    Paddle.Environment.set("sandbox");
  }
  // eslint-disable-next-line no-undef
  Paddle.Setup({ vendor: parseInt(config.paddleVendorId) });
  // eslint-disable-next-line no-undef
  Paddle.Checkout.open({
    product: config.paddleAnnualProductId,
    email: store.currentUser.email,
    successCallback: successCallback,
  });
  $analytics.track("Select Plan", {
    type: "annual",
  });
}

async function successCallback() {
  try {
    await axios.post(
      `${config.functionsUrl}/upgradePlan`,
      {},
      {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      }
    );
  } catch (error) {
    $analytics.track("Failed to update plan info", error.message);
  }
  // TODO send to a thank you page or docs
  $analytics.track("Payment Successful");
}
</script>