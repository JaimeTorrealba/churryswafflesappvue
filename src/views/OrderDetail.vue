<script setup>
import { ref } from 'vue'
import MainSection from '@/components/MainSection.vue'
import { mdiTable } from '@mdi/js'
import TitleBar from '@/components/TitleBar.vue'
import HeroBar from '@/components/HeroBar.vue'
import CardComponent from '@/components/CardComponent.vue'

const titleStack = ref(['Admin', 'Detail'])

</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>Order Detail </hero-bar>
  <main-section>
    <card-component
      class="mb-6"
      title="Last orders"
      :icon="mdiTable"
      has-table
    >
      asd
    </card-component>
  </main-section>
</template>
