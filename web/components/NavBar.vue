<template>
  <nav>
    <div class="max-w-7xl mx-auto px-2 py-4 sm:px-6 lg:px-8">
      <div
        class="relative flex whitespace-nowrap items-center justify-start h-12"
      >
        <div class="absolute inset-y-0 left-0 flex items-center lg:hidden">
          <!-- Mobile menu button-->
          <button
            class="
              inline-flex
              items-center
              justify-center
              p-2
              rounded-md
              text-cyan-50
              hover:text-cyan-300
              focus:outline-none
              focus:ring-2
              focus:ring-inset
              focus:ring-blue-100
            "
            aria-expanded="false"
            @click="showMobileMenu = !showMobileMenu"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Icon when menu is closed. -->
            <!--
            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
          -->
            <svg
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Icon when menu is open. -->
            <!--
            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
          -->
            <svg
              class="hidden h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          class="
            flex-1 flex
            space-x-4
            items-center
            justify-center
            lg:justify-start
          "
        >
          <div
            class="
              flex-shrink-0
              text-cyan-50
              hover:text-cyan-300
              font-bold
              text-2xl
              flex
              items-center
              border-transparent
            "
          >
            <nuxt-link to="/" class="">
              <span
                class="
                  text-lg
                  font-bold
                  leading-tight
                  text-cyan-200
                  hover:text-cyan-300
                "
                ><img
                  src="/favicon.ico"
                  alt="logo"
                  class="w-8 h-8 sm:w-12 sm:h-12 inline mx-2"
                /><span class="mx-2">Single Dispatch</span>
              </span>
            </nuxt-link>
          </div>
        </div>

        <div>
          <div class="hidden lg:block md:ml-6">
            <div class="flex space-x-4 items-center">
              <a
                href="https://blog.singledispatch.com"
                target="_blank"
                class="
                  px-4
                  py-2
                  text-lg
                  font-bold
                  text-cyan-50
                  hover:text-cyan-300
                  rounded-md
                  shadow-md
                  border-transparent
                "
                >Blog
              </a>
              <a
                href="https://chrome.google.com/webstore/detail/single-dispatch/ebphfkpocnckimopiifpfpnnieolonkk"
                target="_blank"
                class="
                  px-4
                  py-2
                  text-lg
                  font-bold
                  bg-pink-600
                  hover:bg-pink-700
                  rounded-md
                  shadow-md
                  border-transparent
                "
                >Add to Chrome
              </a>
              <!-- <div v-if="!store.loggedIn" class="self-center">
                <nuxt-link
                  to="/login"
                  class="
                    text-cyan-50
                    hover:text-cyan-300
                    px-3
                    py-2
                    text-lg
                    font-bold
                    border-transparent
                  "
                  >Sign In</nuxt-link
                >
                <nuxt-link
                  to="/register"
                  class="
                    text-white
                    bg-gradient-to-r
                    from-cyan-600
                    to-teal-600
                    hover:from-cyan-700 hover:to-teal-700
                    px-3
                    py-2
                    rounded-md
                    text-md
                    font-bold
                    mx-4
                  "
                  >Sign Up</nuxt-link
                >
              </div>
              <div v-else>
                <button
                  id="user-menu"
                  class="
                    text-cyan-50
                    hover:text-cyan-300
                    px-3
                    py-2
                    text-lg
                    font-bold
                    border-transparent
                  "
                  aria-haspopup="true"
                  @click="logout"
                >
                  <span>Sign Out</span>
                </button>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--
    Mobile menu, toggle classes based on menu state.

    Menu open: "block", Menu closed: "hidden"
  -->
    <div class="lg:hidden" :class="{ hidden: !showMobileMenu }">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a
          href="https://blog.singledispatch.com"
          target="_blank"
          class="
            block
            px-4
            py-2
            text-lg
            font-bold
            text-cyan-50
            hover:text-cyan-300
            rounded-md
            shadow-md
            border-transparent
          "
          >Blog
        </a>
        <a
          href="https://chrome.google.com/webstore/detail/single-dispatch/ebphfkpocnckimopiifpfpnnieolonkk"
          target="_blank"
          class="
            block
            px-4
            py-2
            text-lg
            font-bold
            bg-pink-600
            hover:bg-pink-700
            rounded-md
            shadow-md
            border-transparent
          "
          >Add to Chrome
        </a>
        <!-- <div v-if="!store.loggedIn">
          <nuxt-link
            to="/login"
            class="
              block
              text-cyan-50
              hover:text-cyan-300
              px-3
              py-2
              text-lg
              font-bold
            "
            >Sign In</nuxt-link
          >
          <nuxt-link
            to="/register"
            class="
              block
              text-white
              bg-gradient-to-r
              from-cyan-600
              to-teal-600
              hover:from-cyan-700 hover:to-teal-700
              px-3
              py-2
              rounded-md
              text-md
              font-bold
            "
            >Sign Up</nuxt-link
          >
        </div>
        <div v-else>
          <button
            id="user-menu"
            class="
              block
              text-cyan-50
              hover:text-cyan-300
              px-3
              py-2
              text-lg
              font-bold
            "
            aria-haspopup="true"
            @click="logout"
          >
            <span>Sign Out</span>
          </button>
        </div> -->
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useStore } from "~/store";
import { signOut } from "firebase/auth";
import { ref } from "vue";

const store = useStore();
const router = useRouter();
const { $firebase } = useNuxtApp();
const showMobileMenu = ref(false);

function logout() {
  signOut($firebase.auth).finally(() => {
    router.go();
  });
}
</script>
