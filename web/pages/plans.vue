<template>
  <div>
    <Pricing
      ><submit
        class="mt-3"
        :is-loading="isLoading"
        :errors="errors"
        :disabled="disabled"
        label="Purchase"
        @click="openCheckout"
    /></Pricing>
  </div>
</template>

<script setup>
import axios from "axios";
import { useStore } from "@/store";
const store = useStore();
const { $analytics } = useNuxtApp();
const router = useRouter();
const config = useRuntimeConfig().public;

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

  async function successCallback() {
    const store = useStore();
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
    $analytics.track("Payment Successful");

    // TODO send to a thank you page or docs
    router.push("/tips");
  }
}
</script>