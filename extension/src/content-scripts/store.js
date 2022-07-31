import { reactive } from "vue";

export const store = reactive({
  commands: [],
  isLoggedIn: false,
  currentUser: {
    preferences: {},
  },
});
