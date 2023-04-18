<script setup lang="ts">
import { calcRes, calcDmg } from '../utils/calculations'

const props = withDefaults(defineProps<{
  res: number;
  dmg: number;
  pierceNonBreaking: number;
  pierceBreaking: number;
  colorClass: string;
  active: boolean;
}>(), {
  active: true,
});
const resAfterPierce = computed((): number => (
  calcRes(props.res, props.pierceNonBreaking, props.pierceBreaking)
))
const immuneBeforePierce = computed(() => props.res > 99)
const immuneAfterPierce = computed(() => resAfterPierce.value > 99)
</script>

<template>
  <div :class="[colorClass, !active && 'opacity-10']">
    <div class="flex flex-row items-center" :class="{ 'text-xs': dmg }">
      <Icon name="ph:shield" />
      <div :class="{ 'font-bold': immuneBeforePierce }">{{ res }}</div>
      <Icon name="ph:arrow-right" :class="{ 'opacity-10': active && !pierceNonBreaking && !pierceBreaking }" />
      <div :class="{
        'font-bold': immuneAfterPierce,
        'opacity-10': active && !pierceNonBreaking && !pierceBreaking
      }">{{ resAfterPierce }}</div>
    </div>
    <div class="flex flex-row items-center" :class="{ 'opacity-10': active && !dmg }">
      <Icon name="ph:sword" />
      <span>{{ Math.round(
        calcDmg(dmg, res, 0, 0)
      ).toLocaleString() }}</span>
      <Icon name="ph:arrow-right" :class="{ 'opacity-10': active && !pierceNonBreaking && !pierceBreaking }" />
      <span :class="{ 'opacity-10': active && !pierceNonBreaking && !pierceBreaking }">{{ Math.round(
        calcDmg(dmg, res, pierceNonBreaking, pierceBreaking)
      ).toLocaleString() }}</span>
    </div>
  </div>
</template>
