<template>
  <Popup :index="index">
    <window
      :title="confirmData.title"
      width="50%"
      confirm
      @close="close"
    >
      <div class="text">
        <div
          v-for="(text, index) in confirmData.text"
          :key="index"
          v-html="text"
        ></div>
      </div>
      <template
        #bottom
        v-if="confirmData.tip"
      >
        <div class="tip">{{ confirmData.tip }}</div>
      </template>
      <template #footer>
        <Btn
          v-if="!confirmData.fn"
          class="win-btn"
          name="知道了"
          @click="close"
        />
        <template v-else>
          <Btn
            class="win-btn"
            name="取消"
            type="wrong"
            @click="close"
          />
          <Btn
            class="win-btn"
            name="确认"
            type="check"
            @click="onConfirml"
          />
        </template>
      </template>
    </window>
  </Popup>
</template>

<script lang="ts" setup>
import Popup from '@/components/Common/Popup.vue'
import Window from '@/components/Common/Window.vue'
import Btn from '@/components/Common/Btn.vue'
import { confirmData } from './'
import { confirmCallback } from '@/assets/scripts/popup'

const props = defineProps<{
  name: string
  index: number
}>()

const emits = defineEmits<{
  (event: 'close', name: string): void
}>()

const close = () => {
  emits('close', props.name)
}

const onConfirml = async () => {
  confirmData.fn?.()
  close()
  return true
}

confirmCallback[props.name] = onConfirml
</script>

<style lang="stylus" scoped>
.text
  margin 50px auto 80px
  text-align center
  font-size 50px

.tip
  padding 10px
  background #e4c680
  text-align center
  font-size 40px
</style>
