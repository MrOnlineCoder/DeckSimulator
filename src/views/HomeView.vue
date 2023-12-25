<template>
  <div class="home-view">
    <v-card width="512" height="512" class="home-card">
      <h1><v-icon>mdi-cards-playing-club-multiple</v-icon></h1>
      <h2>Deck Simulator</h2>
      <p class="text-body">Tool designed to help debug and test card decks for tabletop games</p>
      <br />
      <v-divider></v-divider>
      <br />
      <ul>
        <li>
          <v-icon>mdi-cards</v-icon>
          Create cards, arrange them in decks, and deal on a table
        </li>
        <li>
          <v-icon>mdi-eye</v-icon>
          Simple UI
        </li>
        <li>
          <v-icon>mdi-lan-pending</v-icon>
          No data is stored on server - don't forget to periodically export your data for backups
        </li>
      </ul>
      <br />
      <v-divider></v-divider>
      <br />
      <RouterLink to="/cards">
        <v-btn color="#CDDC39" size="large" prepend-icon="mdi-rocket-launch">
          Proceed to cards editor
        </v-btn>
      </RouterLink>
      <br />
      <br />
      <a href="https://github.com/MrOnlineCoder/DeckSimulator" target="_blank">
        <v-btn size="large" color="#212121" prepend-icon="mdi-star-circle-outline">
          Star on Github
        </v-btn>
      </a>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.home-view {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: calc(100vh - 64px);
}

.home-card {
  padding: 24px;
}
</style>
