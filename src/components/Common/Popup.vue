<template>
  <Transition :name="transition">
    <template v-if="props.show">
      <div
        class="popup"
        v-show="props.index !== -1"
        :style="{ zIndex: baseIndex + index }"
      >
        <slot></slot>
      </div>
    </template>
    <template v-else>
      <div
        class="popup"
        v-if="props.index !== -1"
        :style="{ zIndex: baseIndex + index }"
      >
        <slot></slot>
      </div>
    </template>
  </Transition>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    index: number
    baseIndex?: number
    show?: boolean
    transition?: string
  }>(),
  {
    baseIndex: 20,
    transition: 'fade'
  }
)
</script>

<style lang="stylus" scoped>
.popup
  position absolute
  top 0
  right 0
  bottom 0
  left 0
</style>
