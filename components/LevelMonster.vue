<script setup lang="ts">
function calcRes(res: number, pierceNonBreaking: number = 0, pierceBreaking: number = 0): number {
  let resAfterImmunityRemoval = res;
  if (res > 99) {
    resAfterImmunityRemoval -= Math.floor(pierceBreaking / 2)
  } else {
    resAfterImmunityRemoval -= pierceBreaking
  }

  if (resAfterImmunityRemoval > 99) {
    return resAfterImmunityRemoval
  }

  if ((resAfterImmunityRemoval - pierceNonBreaking) < 0) {
    // Not sure if/how this is rounded within d2, but it is most often
    // in a negative way for the player.
    // should not make a big difference either way
    return Math.floor((resAfterImmunityRemoval - pierceNonBreaking) / 2)
  }

  return resAfterImmunityRemoval - pierceNonBreaking
}

function calcDmg(dmg: number, res: number, pierceNonBreaking: number, pierceBreaking: number): number {
  const resAfterPierce = calcRes(res, pierceNonBreaking, pierceBreaking)
  if (resAfterPierce > 99) {
    return 0
  }
  if (resAfterPierce < 0) {
    return Math.abs(dmg * (-1 + (resAfterPierce / 100)))
  }
  return dmg * (1 - (resAfterPierce / 100))
}

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
  <div :class="[colorClass, !active && 'opacity-20']">
    <div class="flex flex-row items-center">
      <Icon name="ph:shield" />
      <div :class="{ 'font-bold': immuneBeforePierce }">{{ res }}</div>
      <Icon name="ph:arrow-right" />
      <div :class="{ 'font-bold': immuneAfterPierce }">{{ resAfterPierce }}</div>
    </div>
    <div class="flex flex-row items-center" :class="{ 'opacity-20': active && !dmg }">
      <Icon name="ph:sword" />
      <span>{{ Math.round(
        calcDmg(dmg, res, 0, 0)
      ) }}</span>
      <Icon name="ph:arrow-right" />
      <span>{{ Math.round(
        calcDmg(dmg, res, pierceNonBreaking, pierceBreaking)
      ) }}</span>
    </div>
  </div>
</template>
