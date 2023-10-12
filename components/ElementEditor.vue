<script setup lang="ts">
  defineProps<{
    name: string;
    dmg: number;
    pierceNonBreaking: number;
    pierceBreaking: number;
  }>()
  defineEmits<{
    (e: 'update:dmg', value: number): void;
    (e: 'update:pierceNonBreaking', value: number): void;
    (e: 'update:pierceBreaking', value: number): void;
  }>()
</script>

<template>
  <tr>
    <td>{{ name }}</td>
    <td class="w-16">
      <!-- Phys dmg -->
      <input
        :value="dmg"   
        @input="$emit('update:dmg', ($event.target as HTMLInputElement).value || 0)"
        type="text"
        class="w-full text-black text-sm p-1"
        inputmode="numeric"
        pattern="[0-9]*">
    </td>
    <td class="w-16">
      <div class="flex relative w-full items-center">
        <Icon name="ph:percent" class="absolute right-0 pr-1" />
        <!-- Phys pierce non-breaking -->
        <input
          :value="pierceNonBreaking"
          @input="$emit('update:pierceNonBreaking', ($event.target as HTMLInputElement).value || 0)"
          type="text"
          class="w-full text-black text-sm p-1 pr-4"
          inputmode="numeric"
          pattern="[0-9]*">
      </div>
    </td>
    <td class="w-16">
      <div class="flex relative w-full items-center">
        <Icon name="ph:percent" class="absolute right-0 pr-1" />
        <!-- Phys pierce breaking -->
        <input
          :value="pierceBreaking"
          @input="$emit('update:pierceBreaking', ($event.target as HTMLInputElement).value || 0)"
          type="text"
          class="w-full text-black text-sm p-1 pr-4"
          inputmode="numeric"
          pattern="[0-9]*">
      </div>
    </td>
  </tr>
</template>