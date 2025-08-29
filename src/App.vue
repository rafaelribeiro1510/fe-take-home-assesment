<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { RouterView } from 'vue-router';
</script>

<template>
  <v-app>
    <v-main>
      <v-app-bar>
          <v-app-bar-title text="Front-End Engineer Coding Exercise"></v-app-bar-title>
      </v-app-bar>
      <RouterView />
    </v-main>
    <VueQueryDevtools />
  </v-app>
</template>
