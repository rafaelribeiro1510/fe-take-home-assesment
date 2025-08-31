<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { RouterView } from 'vue-router';
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const darkMode = ref(theme.global.name.value === 'dark');

const toggleTheme = () => {
  theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light';
};

watch(theme.global.name, (newTheme) => {
  darkMode.value = newTheme === 'dark';
});

</script>

<template>
  <v-app>
    <v-main>
      <v-app-bar>
          <v-app-bar-title text="Front-End Engineer Coding Exercise"></v-app-bar-title>
          <v-app-bar-actions>
              <v-switch 
                v-model="darkMode" 
                @change="toggleTheme()"
                class="me-4"
                false-icon="mdi-brightness-6"
                true-icon="mdi-brightness-2" />
          </v-app-bar-actions>
      </v-app-bar>
      <RouterView />
    </v-main>
    <VueQueryDevtools />
  </v-app>
</template>
