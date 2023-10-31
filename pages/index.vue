<script setup lang="ts">
import { calcDmg } from '~/utils/calculations'
import levels from '../maps.json'

const router = useRouter()
const route = useRoute()

type Levels = typeof levels
type Level = Levels[number]
type LevelsGroupedByTier = {
  [key: number]: Levels
}
type Monster = Level['monsters'][number]

const updateQueryParam = (paramName: string, e: any) => {
  router.replace({
    query: {
      ...route.query,
      [paramName]: e,
    }
  })
}

const physDmg = ref(0)
const physPierceNonBreaking = ref(0)
const physPierceBreaking = ref(0)
const magicDmg = ref(0)
const magicPierceNonBreaking = ref(0)
const magicPierceBreaking = ref(0)
const fireDmg = ref(0)
const firePierceNonBreaking = ref(0)
const firePierceBreaking = ref(0)
const lightningDmg = ref(0)
const lightningPierceNonBreaking = ref(0)
const lightningPierceBreaking = ref(0)
const coldDmg = ref(0)
const coldPierceNonBreaking = ref(0)
const coldPierceBreaking = ref(0)
const poisonDmg = ref(0)
const poisonPierceNonBreaking = ref(0)
const poisonPierceBreaking = ref(0)

const increasedMaximumHp = ref(0);

watch(physDmg, (newVal) => updateQueryParam('pd', newVal))
watch(physPierceNonBreaking, (newVal) => updateQueryParam('ppnb', newVal))
watch(physPierceBreaking, (newVal) => updateQueryParam('ppb', newVal))
watch(magicDmg, (newVal) => updateQueryParam('md', newVal))
watch(magicPierceNonBreaking, (newVal) => updateQueryParam('mpnb', newVal))
watch(magicPierceBreaking, (newVal) => updateQueryParam('mpb', newVal))
watch(fireDmg, (newVal) => updateQueryParam('fd', newVal))
watch(firePierceNonBreaking, (newVal) => updateQueryParam('fpnb', newVal))
watch(firePierceBreaking, (newVal) => updateQueryParam('fpb', newVal))
watch(lightningDmg, (newVal) => updateQueryParam('ld', newVal))
watch(lightningPierceNonBreaking, (newVal) => updateQueryParam('lpnb', newVal))
watch(lightningPierceBreaking, (newVal) => updateQueryParam('lpb', newVal))
watch(coldDmg, (newVal) => updateQueryParam('cd', newVal))
watch(coldPierceNonBreaking, (newVal) => updateQueryParam('cpnb', newVal))
watch(coldPierceBreaking, (newVal) => updateQueryParam('cpb', newVal))
watch(poisonDmg, (newVal) => updateQueryParam('pod', newVal))
watch(poisonPierceNonBreaking, (newVal) => updateQueryParam('popnb', newVal))
watch(poisonPierceBreaking, (newVal) => updateQueryParam('popb', newVal))

watch(increasedMaximumHp, (newVal) => updateQueryParam('imhp', newVal))

const selectedLevelNames = ref([] as Array<string>)
watch(selectedLevelNames, (newVal) => {
  updateQueryParam('l', newVal.join(','))
})

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
const resultingDmg = (monster: Monster) => (
  calcDmg(physDmg.value, monster.physRes, physPierceNonBreaking.value, physPierceBreaking.value) +
  calcDmg(magicDmg.value, monster.magicRes, magicPierceNonBreaking.value, magicPierceBreaking.value) +
  calcDmg(fireDmg.value, monster.fireRes, firePierceNonBreaking.value, firePierceBreaking.value) +
  calcDmg(lightningDmg.value, monster.lightningRes, lightningPierceNonBreaking.value, lightningPierceBreaking.value) +
  calcDmg(coldDmg.value, monster.coldRes, coldPierceNonBreaking.value, coldPierceBreaking.value) +
  calcDmg(poisonDmg.value, monster.poisonRes, poisonPierceNonBreaking.value, poisonPierceBreaking.value)
);
const monsterMaxHp = (monster: Monster) => (
  monster.maxHpOpenBnet * (1 + (increasedMaximumHp.value / 100))
);
const monsterIsDead = (monster: Monster) => (
  resultingDmg(monster) >= monsterMaxHp(monster)
);
const monsterPercentDmg = (monster: Monster) => (
  (resultingDmg(monster) / monsterMaxHp(monster)) * 100
);

onMounted(() => {
  physDmg.value = parseInt((route.query.pd || '0') as string)
  physPierceNonBreaking.value = parseInt((route.query.ppnb || '0') as string)
  physPierceBreaking.value = parseInt((route.query.ppb || '0') as string)
  magicDmg.value = parseInt((route.query.md || '0') as string)
  magicPierceNonBreaking.value = parseInt((route.query.mpnb || '0') as string)
  magicPierceBreaking.value = parseInt((route.query.mpb || '0') as string)
  fireDmg.value = parseInt((route.query.fd || '0') as string)
  firePierceNonBreaking.value = parseInt((route.query.fpnb || '0') as string)
  firePierceBreaking.value = parseInt((route.query.fpb || '0') as string)
  lightningDmg.value = parseInt((route.query.ld || '0') as string)
  lightningPierceNonBreaking.value = parseInt((route.query.lpnb || '0') as string)
  lightningPierceBreaking.value = parseInt((route.query.lpb || '0') as string)
  coldDmg.value = parseInt((route.query.cd || '0') as string)
  coldPierceNonBreaking.value = parseInt((route.query.cpnb || '0') as string)
  coldPierceBreaking.value = parseInt((route.query.cpb || '0') as string)
  poisonDmg.value = parseInt((route.query.pod || '0') as string)
  poisonPierceNonBreaking.value = parseInt((route.query.popnb || '0') as string)
  poisonPierceBreaking.value = parseInt((route.query.popb || '0') as string)

  increasedMaximumHp.value = parseInt((route.query.imhp || '0') as string)

  if (!route.query.l) {
    selectedLevelNames.value = ['Arreat Battlefield']
  } else {
    const levelsFromQuery = (route.query.l as string).split(',')
    selectedLevelNames.value = levelsFromQuery
  }
})
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
        <table class="table-auto text-sm w-full mt-6">
          <thead>
            <tr class="tracking-tight text-xs">
              <th class="text-left">Increased maximum HP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="flex relative w-16 items-center">
                  <Icon name="ph-percent" class="absolute text-black right-0 pr-1" />
                  <input
                    v-model="increasedMaximumHp"
                    type="text"
                    class="w-full text-black text-sm p-1 pr-4"
                    inputmode="numeric"
                    pattern="[0-9]*">
                </div>
              </td>
            </tr>
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
                <th class="text-start text-xs w-20">Remaining HP (experimental)</th>
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
              <td class="align-middle border-b border-black dark:border-white pb-2 pt-2 pr-8">
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
                  {{ resultingDmg(monster).toLocaleString() }}
                </div>
              </td>
              <td class="align-middle border-b border-black dark:border-white pb-2 pt-2">
                <div class="w-full bg-stone-700 h-4" :title="'Monster HP range: ' + monster.minHpOpenBnet.toLocaleString() + ' - ' + Math.round(monsterMaxHp(monster)).toLocaleString()">
                  <div class="bg-red-700 h-4" :style="{ width: String(Math.max(100 - monsterPercentDmg(monster), 0)) + '%' }"></div>
                  <div class="w-full flex justify-center -mt-4 items-center">
                    <Icon v-if="monsterIsDead(monster)" name="ph-skull" />
                    <div class="text-xs" v-else>{{ Math.round(100 - monsterPercentDmg(monster)) }}%</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>