<script setup lang="ts">
import { calcDmg } from '~/utils/calculations';
import levels from '../maps.json'

type Levels = typeof levels
type Level = Levels[number]
type LevelsGroupedByTier = {
  [key: number]: Levels
}

const physDmg = ref(0);
const physPierceNonBreaking = ref(0);
const physPierceBreaking = ref(0);
const magicDmg = ref(0);
const magicPierceNonBreaking = ref(0);
const magicPierceBreaking = ref(0);
const fireDmg = ref(0);
const firePierceNonBreaking = ref(0);
const firePierceBreaking = ref(0);
const lightningDmg = ref(0);
const lightningPierceNonBreaking = ref(0);
const lightningPierceBreaking = ref(0);
const coldDmg = ref(0);
const coldPierceNonBreaking = ref(0);
const coldPierceBreaking = ref(0);
const poisonDmg = ref(0);
const poisonPierceNonBreaking = ref(0);
const poisonPierceBreaking = ref(0);

const selectedLevelNames = ref(['Arreat Battlefield'])

const sortLevels = (l1: Level, l2: Level) => (
  l1.tier - l2.tier || l1.displayName.localeCompare(l2.displayName)
)

const sortedLevels = computed(() => (
  levels.slice(0).sort(sortLevels)
))
const selectedLevels = computed(() => (
  sortedLevels.value.filter((l) => selectedLevelNames.value.includes(l.displayName))
))

const levelsGroupedByTier = computed(() => (
  sortedLevels.value.reduce((acc, curr) => {
    if (!acc[curr.tier]) {
      acc[curr.tier] = []
    }
    acc[curr.tier].push(curr)
    return acc
  }, {} as LevelsGroupedByTier)
))
const hasDmg = computed(() => (
  physDmg.value || magicDmg.value || fireDmg.value || lightningDmg.value || coldDmg.value || poisonDmg.value
))
</script>

<template>
  <div class="flex h-screen">
    <div class="bg-black text-white w-64 overflow-y-scroll pl-2 pr-2 border-black border-l-solid border-l-1">
      <dl class="text-sm mt-2">
        <dt class="font-bold">Damage</dt>
        <dd class="ml-4">Your sheet damage</dd>

        <dt class="font-bold mt-2">Non breaking pierce</dt>
        <dd class="ml-4">The sum of pierce that does not break immunities (e.g. facets)</dd>

        <dt class="font-bold mt-2">Breaking pierce</dt>
        <dd class="ml-4">The sum of pierce that <em>does</em> break immunities (e.g. Conviction)</dd>
      </dl>

      <form class="mt-6">
        <table class="table-auto text-sm">
          <thead>
            <tr class="tracking-tight text-xs">
              <th>Element</th>
              <th>Damage</th>
              <th>Non breaking pierce</th>
              <th>Breaking pierce</th>
            </tr>
          </thead>
          <tbody>
            <ElementEditor
              name="Physical"
              v-model:dmg.number="physDmg"
              v-model:pierceNonBreaking.number="physPierceNonBreaking"
              v-model:pierceBreaking.number="physPierceBreaking" />
            <ElementEditor
              name="Magic"
              v-model:dmg.number="magicDmg"
              v-model:pierceNonBreaking.number="magicPierceNonBreaking"
              v-model:pierceBreaking.number="magicPierceBreaking" />
            <ElementEditor
              name="Fire"
              v-model:dmg.number="fireDmg"
              v-model:pierceNonBreaking.number="firePierceNonBreaking"
              v-model:pierceBreaking.number="firePierceBreaking" />
            <ElementEditor
              name="Lightning"
              v-model:dmg.number="lightningDmg"
              v-model:pierceNonBreaking.number="lightningPierceNonBreaking"
              v-model:pierceBreaking.number="lightningPierceBreaking" />
            <ElementEditor
              name="Cold"
              v-model:dmg.number="coldDmg"
              v-model:pierceNonBreaking.number="coldPierceNonBreaking"
              v-model:pierceBreaking.number="coldPierceBreaking" />
            <ElementEditor
              name="Poison"
              v-model:dmg.number="poisonDmg"
              v-model:pierceNonBreaking.number="poisonPierceNonBreaking"
              v-model:pierceBreaking.number="poisonPierceBreaking" />
          </tbody>
        </table>
      </form>

      <nav class="text-sm mb-4 mt-6">
        <template v-for="(levelsInTier, tier) in levelsGroupedByTier">
          <h3>Tier {{ tier }}</h3>
          <ul class="ml-2">
            <li v-for="level in levelsInTier" class="flex items-center">
              <label>
                <input type="checkbox" :value="level.displayName" v-model="selectedLevelNames" class="mr-1">
                {{ level.displayName }}
              </label>
              <a v-if="selectedLevelNames.includes(level.displayName)" class="underline ml-1 text-xs" :href="`#${level.displayName}`">link</a>
            </li>
          </ul>
        </template>
      </nav>
    </div>

    <div class="grow pl-2 overflow-y-scroll border-slate-500 border-l-solid border-l bg-white dark:bg-slate-800 text-black dark:text-white">
      <div v-for="level in selectedLevels" :key="level.displayName" :id="level.displayName" class="mb-8 text-sm">
        <h1 class="text-lg tracking-wide font-bold">
          {{ level.displayName }}
          <span class="text-gray-500 text-md tracking-tight ml-2">Tier {{ level.tier }}</span>
        </h1>
        <table class="table-fixed border-separate border-spacing-y-0 border-spacing-x-0">
          <thead>
            <tr>
                <th class="text-start text-xs">Monster</th>
                <th class="text-start text-xs w-20">Phys</th>
                <th class="text-start text-xs w-20">Magic</th>
                <th class="text-start text-xs w-20">Fire</th>
                <th class="text-start text-xs w-20">Light</th>
                <th class="text-start text-xs w-20">Cold</th>
                <th class="text-start text-xs w-20">Poison</th>
                <th class="text-start text-xs w-20">Sum Damage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="monster in level.monsters" :key="monster.displayName">
              <td class="align-bottom border-b border-black dark:border-white pb-2 pt-2 pr-8">{{ monster.displayName }}</td>
              <td class="align-bottom border-b border-black dark:border-white pb-2 pt-2 pr-8">
                <LevelMonster
                  :active="!hasDmg || Boolean(physDmg)"
                  :res="monster.physRes"
                  :dmg="physDmg"
                  :pierceNonBreaking="physPierceNonBreaking"
                  :pierceBreaking="physPierceBreaking"
                  colorClass="text-stone-500"
                />
              </td>
              <td class="align-bottom border-b border-black dark:border-white pb-2 pt-2 pr-8">
                <LevelMonster
                  :active="!hasDmg || Boolean(magicDmg)"
                  :res="monster.magicRes"
                  :dmg="magicDmg"
                  :pierceNonBreaking="magicPierceNonBreaking"
                  :pierceBreaking="magicPierceBreaking"
                  colorClass="text-violet-500"
                />
              </td>
              <td class="align-bottom border-b border-black dark:border-white pb-2 pt-2 pr-8">
                <LevelMonster
                  :active="!hasDmg || Boolean(fireDmg)"
                  :res="monster.fireRes"
                  :dmg="fireDmg"
                  :pierceNonBreaking="firePierceNonBreaking"
                  :pierceBreaking="firePierceBreaking"
                  colorClass="text-red-500"
                />
              </td>
              <td class="align-bottom border-b border-black dark:border-white pb-2 pt-2 pr-8">
                <LevelMonster
                  :active="!hasDmg || Boolean(lightningDmg)"
                  :res="monster.lightningRes"
                  :dmg="lightningDmg"
                  :pierceNonBreaking="lightningPierceNonBreaking"
                  :pierceBreaking="lightningPierceBreaking"
                  colorClass="text-yellow-600"
                />
              </td>
              <td class="align-bottom border-b border-black dark:border-white pb-2 pt-2 pr-8">
                <LevelMonster
                  :active="!hasDmg || Boolean(coldDmg)"
                  :res="monster.coldRes"
                  :dmg="coldDmg"
                  :pierceNonBreaking="coldPierceNonBreaking"
                  :pierceBreaking="coldPierceBreaking"
                  colorClass="text-blue-500"
                />
              </td>
              <td class="align-bottom border-b border-black dark:border-white pb-2 pt-2 pr-8">
                <LevelMonster
                  :active="!hasDmg || Boolean(poisonDmg)"
                  :res="monster.poisonRes"
                  :dmg="poisonDmg"
                  :pierceNonBreaking="poisonPierceNonBreaking"
                  :pierceBreaking="poisonPierceBreaking"
                  colorClass="text-green-600"
                />
              </td>
              <td class="align-bottom border-b border-black dark:border-white pb-2 pt-2">
                <div class="flex flex-row items-center" :class="{ 'opacity-20': !hasDmg }">
                  <Icon name="ph:sword" />
                  {{
                    Math.round(
                      calcDmg(physDmg, monster.physRes, 0, 0) +
                      calcDmg(fireDmg, monster.fireRes, 0, 0) +
                      calcDmg(lightningDmg, monster.lightningRes, 0, 0) +
                      calcDmg(coldDmg, monster.coldRes, 0, 0) +
                      calcDmg(poisonDmg, monster.poisonRes, 0, 0)
                    ).toLocaleString()
                  }}
                  <Icon name="ph:arrow-right" />
                  {{
                    Math.round(
                      calcDmg(physDmg, monster.physRes, physPierceNonBreaking, physPierceBreaking) +
                      calcDmg(fireDmg, monster.fireRes, firePierceNonBreaking, firePierceBreaking) +
                      calcDmg(lightningDmg, monster.lightningRes, lightningPierceNonBreaking, lightningPierceBreaking) +
                      calcDmg(coldDmg, monster.coldRes, coldPierceNonBreaking, coldPierceBreaking) +
                      calcDmg(poisonDmg, monster.poisonRes, poisonPierceNonBreaking, poisonPierceBreaking)
                    ).toLocaleString()
                  }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>