<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <v-card>
      <v-card-title class="text-h5">Session Expired</v-card-title>
      <v-card-text>Your session has expired. Please log in again.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="redirectToLogin">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    show() {
      this.dialog = true;
    },
    redirectToLogin() {
      this.dialog = false;
      this.$router.push("/signin");
    },
  },
};
</script>
