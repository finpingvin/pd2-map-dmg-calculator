<script setup lang="ts">
const avgSheetDmg = ref(0)
const deadlyStrike = ref(0)
const masteryCrit = ref(0)
const skillCrit = ref(0)
const critMultiplier = 0.5

const critChance = computed(() => (
  1 - (
    (1 - Math.min(deadlyStrike.value / 100, 0.75))
    * (1 - Math.min(masteryCrit.value / 100, 0.75))
    * (1 - Math.min(skillCrit.value / 100, 0.75))
  )
))
const avgCritDmg = computed(() => (
  avgSheetDmg.value * critChance.value * critMultiplier
))
</script>

<template>
  <div class="flex flex-col w-64 m-auto">
    <h1 class="mt-4">PD2 Crit Calculator</h1>
    <div class="mt-4">
      <div>
        <label for="avgSheetDmg">Average sheet damage</label>
        <input
          v-model.number="avgSheetDmg"
          id="avgSheetDmg"
          type="text"
          class="w-full text-black text-sm p-1"
          inputmode="numeric"
          pattern="[0-9]*">
      </div>
      <div class="mt-2">
        <label for="deadlyStrike">Deadly strike</label>
        <div class="flex relative w-full items-center">
          <Icon name="ph:percent" class="absolute right-0 pr-1" />
          <input
            v-model.number="deadlyStrike"
            id="deadlyStrike"
            type="text"
            class="w-full text-black text-sm p-1 pr-4"
            inputmode="numeric"
            pattern="[0-9]*">
        </div>
      </div>
      <div class="mt-2">
        <label for="masteryCrit">Mastery crit</label>
        <div class="flex relative w-full items-center">
          <Icon name="ph:percent" class="absolute right-0 pr-1" />
          <input
            v-model.number="masteryCrit"
            type="text"
            class="w-full text-black text-sm p-1 pr-4"
            inputmode="numeric"
            pattern="[0-9]*">
        </div>
      </div>
      <div class="mt-2">
        <label for="skillCrit">Critical strike</label>
        <div class="flex relative w-full items-center">
          <Icon name="ph:percent" class="absolute right-0 pr-1" />
          <input
            v-model="skillCrit"
            type="text"
            class="w-full text-black text-sm p-1 pr-4"
            inputmode="numeric"
            pattern="[0-9]*">
        </div>
      </div>
    </div>

    <div class="mt-6">
      <h3 class="text-md font-bold">Result</h3>
      <table>
        <tr>
          <td class="pr-2">Crit chance</td>
          <td>{{ Math.round(critChance * 100).toLocaleString() }}%</td>
        </tr>
        <tr>
          <td class="pr-2">Average crit damage</td>
          <td>{{ Math.round(avgCritDmg).toLocaleString() }}</td>
        </tr>
        <tr>
          <td class="pr-2">Average total damage</td>
          <td>{{ (Math.round(avgSheetDmg) + Math.round(avgCritDmg)).toLocaleString() }}</td>
        </tr>
      </table>

      <dl class="text-sm mt-6">
        <dt class="font-bold">Crit chance</dt>
        <dd class="ml-4">Your total chance of achieving crit per strike. The different crit chances are not additive but separate rolls.</dd>

        <dt class="font-bold mt-2">Average crit damage</dt>
        <dd class="ml-4">The damage crit adds on average to your attack. Successful crit adds 50% of your regular damage to your attack in PD2. <em>Average sheet damage * Crit chance * 0.5</em></dd>

        <dt class="font-bold mt-2">Average total damage</dt>
        <dd class="ml-4">Your total average damage with crit. <em>Average sheet damage + Average crit damage</em></dd>
      </dl>
    </div>
  </div>
</template>