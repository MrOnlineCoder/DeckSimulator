<template>
  <div
    class="game-card"
    :class="{
      covered
    }"
    @click="$emit('click')"
  >
    <b class="text-subtitle-1 font-weight-black" v-if="!covered"> {{ card.title }}</b>
    <h3 v-else-if="index">Card {{ index }}</h3>
    <div class="text-caption" v-if="!covered && card.description">
      {{ card.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '@/entities/card'

const props = defineProps<{
  card: Card
  index?: number
  covered?: boolean
}>()
</script>

<style scoped>
.game-card {
  width: 256px;
  height: calc(256px * 1.33);
  border: 4px solid #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-direction: column;
  row-gap: 16px;
  justify-content: center;
  text-align: center;
  padding: 0 8px;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
    rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
}

.game-card.covered {
  background-color: #9ccc65;
}
</style>
