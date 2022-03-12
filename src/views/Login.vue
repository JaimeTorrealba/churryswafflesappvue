<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'

import FullScreenSection from '@/components/FullScreenSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Divider from '@/components/Divider.vue'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import { login, islogin } from '@/utils/firebase'

const form = reactive({
  login: '',
  pass: ''
})

const rules = {
  login: { email },
  pass: { required }
}
const v$ = useVuelidate(rules, form)

const router = useRouter()

const submit = async () => {
  if (v$.value.$invalid !== true) {
    await login(form.login, form.pass)
    const isAuth = await islogin()
    if (isAuth) {
      router.push('/dashboard')
    } else {
      alert('Problems for login')
    }
  } else {
    alert('error en los campos')
  }
}
</script>

<template>
  <full-screen-section
    v-slot="{ cardClass, cardRounded }"
    bg="login"
  >
    <card-component
      :class="cardClass"
      :rounded="cardRounded"
      form
      @submit.prevent="submit"
    >
      <field
        label="Login"
        help="Please enter your login"
      >
        <control
          v-model="form.login"
          :icon="mdiAccount"
          name="login"
          autocomplete="username"
        />
      </field>
      <div
        v-for="error of v$.login.$silentErrors"
        :key="error.$uid"
        class="input-errors"
      >
        <div class="error-msg">
          {{ error.$message }}
        </div>
      </div>

      <field
        label="Password"
        help="Please enter your password"
      >
        <control
          v-model="form.pass"
          :icon="mdiAsterisk"
          type="password"
          name="password"
          autocomplete="current-password"
        />
      </field>
      <div
        v-for="error of v$.pass.$silentErrors"
        :key="error.$uid"
        class="input-errors"
      >
        <div class="error-msg">
          {{ error.$message }}
        </div>
      </div>

      <divider />

      <jb-buttons>
        <jb-button
          type="submit"
          color="info"
          label="Login"
        />
      </jb-buttons>
    </card-component>
  </full-screen-section>
</template>
