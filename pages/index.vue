<script setup lang="ts">
import { calcDmg } from '~/utils/calculations';
import levels from '../maps.json'

const router = useRouter();
const route = useRoute();

type Levels = typeof levels
type Level = Levels[number]
type LevelsGroupedByTier = {
  [key: number]: Levels
}

const physDmg = computed(() => parseInt((route.query.pd || '0') as string));
const physPierceNonBreaking = computed(() => parseInt((route.query.ppnb || '0') as string));
const physPierceBreaking = computed(() => parseInt((route.query.ppb || '0') as string));
const magicDmg = computed(() => parseInt((route.query.md || '0') as string));
const magicPierceNonBreaking = computed(() => parseInt((route.query.mpnb || '0') as string));
const magicPierceBreaking = computed(() => parseInt((route.query.mpb || '0') as string));
const fireDmg = computed(() => parseInt((route.query.fd || '0') as string));
const firePierceNonBreaking = computed(() => parseInt((route.query.fpnb || '0') as string));
const firePierceBreaking = computed(() => parseInt((route.query.fpb || '0') as string));
const lightningDmg = computed(() => parseInt((route.query.ld || '0') as string));
const lightningPierceNonBreaking = computed(() => parseInt((route.query.lpnb || '0') as string));
const lightningPierceBreaking = computed(() => parseInt((route.query.lpb || '0') as string));
const coldDmg = computed(() => parseInt((route.query.cd || '0') as string));
const coldPierceNonBreaking = computed(() => parseInt((route.query.cpnb || '0') as string));
const coldPierceBreaking = computed(() => parseInt((route.query.cpb || '0') as string));
const poisonDmg = computed(() => parseInt((route.query.pod || '0') as string));
const poisonPierceNonBreaking = computed(() => parseInt((route.query.popnb || '0') as string));
const poisonPierceBreaking = computed(() => parseInt((route.query.popb || '0') as string));

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
  physDmg.value
  || magicDmg.value
  || fireDmg.value
  || lightningDmg.value
  || coldDmg.value
  || poisonDmg.value
))

const onQueryParamNumberUpdate = (paramName: string, e: number) => {
  router.replace({
    query: {
      ...route.query,
      [paramName]: e,
    }
  })
}
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
              :dmg="physDmg"
              @update:dmg="onQueryParamNumberUpdate('pd', $event)"
              :pierceNonBreaking="physPierceNonBreaking"
              @update:pierceNonBreaking="onQueryParamNumberUpdate('ppnb', $event)"
              :pierceBreaking="physPierceBreaking"
              @update:pierceBreaking="onQueryParamNumberUpdate('ppb', $event)" />
            <ElementEditor
              name="Magic"
              :dmg="magicDmg"
              @update:dmg="onQueryParamNumberUpdate('md', $event)"
              :pierceNonBreaking="magicPierceNonBreaking"
              @update:pierceNonBreaking="onQueryParamNumberUpdate('mpnb', $event)"
              :pierceBreaking="magicPierceBreaking"
              @update:pierceBreaking="onQueryParamNumberUpdate('mpb', $event)" />
            <ElementEditor
              name="Fire"
              :dmg="fireDmg"
              @update:dmg="onQueryParamNumberUpdate('fd', $event)"
              :pierceNonBreaking="firePierceNonBreaking"
              @update:pierceNonBreaking="onQueryParamNumberUpdate('fpnb', $event)"
              :pierceBreaking="firePierceBreaking"
              @update:pierceBreaking="onQueryParamNumberUpdate('fpb', $event)" />
            <ElementEditor
              name="Lightning"
              :dmg="lightningDmg"
              @update:dmg="onQueryParamNumberUpdate('ld', $event)"
              :pierceNonBreaking="lightningPierceNonBreaking"
              @update:pierceNonBreaking="onQueryParamNumberUpdate('lpnb', $event)"
              :pierceBreaking="lightningPierceBreaking"
              @update:pierceBreaking="onQueryParamNumberUpdate('lpb', $event)" />
            <ElementEditor
              name="Cold"
              :dmg="coldDmg"
              @update:dmg="onQueryParamNumberUpdate('cd', $event)"
              :pierceNonBreaking="coldPierceNonBreaking"
              @update:pierceNonBreaking="onQueryParamNumberUpdate('cpnb', $event)"
              :pierceBreaking="coldPierceBreaking"
              @update:pierceBreaking="onQueryParamNumberUpdate('cpb', $event)" />
            <ElementEditor
              name="Poison"
              :dmg="poisonDmg"
              @update:dmg="onQueryParamNumberUpdate('pod', $event)"
              :pierceNonBreaking="poisonPierceNonBreaking"
              @update:pierceNonBreaking="onQueryParamNumberUpdate('popnb', $event)"
              :pierceBreaking="poisonPierceBreaking"
              @update:pierceBreaking="onQueryParamNumberUpdate('popb', $event)" />
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
                  colorClass="text-stone-500 dark:text-stone-400"
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
                <div class="flex flex-row items-center" :class="{ 'opacity-15': !hasDmg }">
                  <Icon name="ph:sword" />
                  {{
                    Math.round(
                      calcDmg(physDmg, monster.physRes, 0, 0) +
                      calcDmg(fireDmg, monster.fireRes, 0, 0) +
                      calcDmg(lightningDmg, monster.lightningRes, 0, 0) +
                      calcDmg(coldDmg, monster.coldRes, 0, 0) +
                      calcDmg(magicDmg, monster.magicRes, 0, 0) +
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