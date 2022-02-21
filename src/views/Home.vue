<script setup>
import { ref } from 'vue'
import { mdiCartOutline } from '@mdi/js'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'
import HeroBar from '@/components/HeroBar.vue'
import CardComponent from '@/components/CardComponent.vue'
import ClientsTable from '@/components/dashboard/newOrdersTable.vue'
import CardWidget from '@/components/CardWidget.vue'

const titleStack = ref(['Admin', 'Dashboard'])

</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>New orders </hero-bar>
  <main-section>
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
      <card-widget
        trend="12%"
        trend-type="up"
        color="text-blue-500"
        :icon="mdiCartOutline"
        :number="7770"
        prefix="$"
        label="Total from the app"
      />
    </div>
    <card-component
      class="mb-6"
      title="Last orders"
      :icon="mdiAccountMultiple"
      has-table
    >
      <clients-table />
    </card-component>
  </main-section>
</template>
