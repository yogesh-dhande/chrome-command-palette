<template>
  <form-page>
    <form
      class="
        max-w-lg
        m-4
        pt-6
        pb-12
        px-10
        bg-gray-900 bg-opacity-50
        rounded-lg
        shadow-xl
      "
    >
      <div class="mt-3">
        <label class="block text-sm font-medium mt-2 mb-0">Email</label>
        <div class="mt-1">
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            rows="3"
            class="
              shadow-sm
              focus:ring-gray-500 focus:border-gray-500
              mt-1
              p-2
              block
              w-full
              text-sm
              bg-gray-900
              rounded-md
            "
            @focus="clearErrors"
          />
        </div>
      </div>
      <div v-if="!fpform">
        <password-input
          v-if="!fpform"
          v-model="password"
          class="mt-3"
          label="Password"
          @input="clearErrors"
        ></password-input>
        <submit
          class="mt-3"
          :is-loading="isLoading"
          :errors="errors"
          label="Sign In"
          @click="login"
        />
      </div>
      <div v-else>
        <submit
          class="mt-3"
          :is-loading="isLoading"
          :errors="errors"
          label="Send Password Reset Link"
          @click="forgotPassword"
        />
      </div>

      <div class="py-1 sm:px-6 text-sm font-medium">
        <span class="float-left">
          <nuxt-link
            to="/register"
            class="
              p-1
              inline-flex
              justify-center
              rounded
              hover:underline
              outline-none
              focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
            "
          >
            <span>Sign Up</span>
          </nuxt-link>
        </span>
        <span class="float-right">
          <button
            ref="fpButton"
            type="submit"
            class="
              p-1
              inline-flex
              justify-center
              rounded
              hover:underline
              outline-none
              focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
            "
            @click.prevent="fp"
          >
            <span v-if="!fpform">Forgot password?</span>
            <span v-else>Login</span>
          </button>
        </span>
      </div>
    </form>
  </form-page>
</template>
<script>
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useStore } from "~/store";

export default {
  beforeRouteLeave(to, from, next) {
    // Reset internal state when leaving the page so avoid confusion
    this.fpform = false;
    next();
  },
  middleware: "guest",
  data() {
    const { $analytics, $firebase } = useNuxtApp();
    const { query } = useRoute();

    return {
      redirect: query.redirect ? query.redirect : "/",
      analytics: $analytics,
      firebase: $firebase,
      email: "",
      password: "",
      fpform: false,
      errors: [],
      loading: false,
      isLoading: false,
    };
  },
  computed: {
    hasErrors() {
      return this.errors.length > 0;
    },
  },
  methods: {
    async login() {
      const store = useStore();
      this.errors = [];
      this.isLoading = true;
      try {
        const userCredential = await signInWithEmailAndPassword(
          this.firebase.auth,
          this.email,
          this.password
        );
        this.analytics.track("Log In");

        store.setAuthState(userCredential.user);

        const snap = await getDoc(
          doc(this.firebase.db, "users", userCredential.user.uid)
        );
        store.setUserData(snap.data() || {});
        this.$router.push(this.redirect);
      } catch (error) {
        this.errors.push(error.message);
        this.analytics.track("Error", { errors: this.errors });
      } finally {
        this.isLoading = false;
      }
    },

    forgotPassword() {
      this.errors = [];
      this.isLoading = true;
      sendPasswordResetEmail(this.firebase.auth, this.email)
        .then(() => {
          this.fpform = false;
          alert("Check your email for password reset link");
          this.$router.push("/");
        })
        .catch((error) => {
          this.errors.push(error.message);
        })
        .finally(() => (this.isLoading = false));
    },
    fp() {
      this.fpform = !this.fpform;
      this.errors = [];
      this.$refs.fpButton.blur();
    },
    clearErrors() {
      this.errors = [];
    },
  },
};
</script>
<style>
</style>