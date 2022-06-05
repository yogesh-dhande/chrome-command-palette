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
        <label class="block text-sm font-medium mt-2 mb-0"> Email </label>
        <div class="mt-1">
          <input
            id="email"
            v-model="email"
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
            @focus="
              emailErrors = [];
              errors = [];
            "
            @blur="validateEmail"
          />
        </div>
      </div>
      <input-errors :errors="emailErrors"></input-errors>

      <password-input
        v-model="password"
        class="mt-3"
        label="Password"
        @focus="
          passwordErrors = [];
          errors = [];
        "
        @blur="validatePassword"
      ></password-input>
      <input-errors :errors="passwordErrors"></input-errors>

      <password-input
        v-model="passwordConfirmation"
        class="mt-3"
        label="Confirm Password"
        @focus="
          passwordConfirmationErrors = [];
          errors = [];
        "
        @blur="validatePasswordConfirmation"
      ></password-input>
      <input-errors :errors="passwordConfirmationErrors"></input-errors>
      <Pricing />
      <submit
        class="mt-3"
        :is-loading="isLoading"
        :errors="errors"
        :disabled="disabled"
        label="Sign Up"
        @click="register"
      />
      <div class="py-1 sm:px-6 text-md font-medium">
        <span class="float-right">
          <nuxt-link
            to="/login"
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
            Sign In
          </nuxt-link>
        </span>
      </div>
    </form>
  </form-page>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import InputErrors from "~/components/InputErrors.vue";
import axios from "axios";

export default {
  middleware: "guest",
  components: {
    InputErrors,
  },
  data() {
    const { $analytics, $firebase } = useNuxtApp();
    const config = useRuntimeConfig().public;
    return {
      splitbee: $analytics,
      firebase: $firebase,
      BASE_URL: config.baseUrl,
      functionsUrl: config.functionsUrl,
      email: "",
      emailErrors: [],
      password: "",
      passwordErrors: [],
      passwordConfirmation: "",
      passwordConfirmationErrors: [],
      isLoading: false,
      errors: [],
      otherErrors: [],
    };
  },
  computed: {
    allErrors() {
      return [].concat(
        this.errors,
        this.emailErrors,
        this.passwordErrors,
        this.passwordConfirmationErrors
      );
    },
    disabled() {
      if (this.allErrors.length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    async register(e) {
      e.preventDefault();
      // on each new attempt clear the old errors
      this.errors = [];
      if (this.isFormValid()) {
        // set loading class to true
        this.isLoading = true;
        try {
          const res = await axios.post(`${this.functionsUrl}/signUp`, {
            email: this.email,
            password: this.password,
            passwordConfirmation: this.passwordConfirmation,
          });
          const userCredential = await signInWithEmailAndPassword(
            this.firebase.auth,
            this.email,
            this.password
          );
          this.firebase.sendVerificationEmail(userCredential.user);
          this.splitbee.track("Sign Up");
          this.$router.push("/");
        } catch (error) {
          if (error.response && error.response.data.message) {
            this.errors.push(error.response.data.message);
          }
          this.splitbee.track("Error", { errors: this.errors });
        } finally {
          this.isLoading = false;
        }
      }
    },
    isEmpty() {
      if (
        this.email.length === 0 ||
        this.password.length === 0 ||
        this.passwordConfirmation.length === 0
      ) {
        return true;
      }
      return false;
    },
    validatePassword() {
      if (!this.password || this.password.length < 6) {
        this.passwordErrors.push(
          "Password must be at least 6 characters long."
        );
      }
    },
    validatePasswordConfirmation() {
      if (this.password !== this.passwordConfirmation) {
        this.passwordConfirmationErrors.push("Passwords do not match.");
      }
    },
    validateEmail() {
      if (!this.email || this.email.length === 0) {
        this.emailErrors.push("Please enter an email.");
      } else if (!/^[0-9a-zA-Z_.-@]+$/.test(this.email)) {
        this.emailErrors.push("No spaces allowed in the email.");
      }
    },
    isFormValid() {
      if (this.isEmpty()) {
        this.errors.push("Please complete all fields.");
        return false;
      }
      return true;
    },
    clearErrors() {
      this.errors = [];
      this.otherErrors = [];
    },
  },
};
</script>
