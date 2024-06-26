import log from '@/assets/data/log'
import { data } from '@/store/data'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { IndexedDB } from './indexedDB'
import { getDetails } from './lightcone'
import { closeWindow, openWindow } from './popup'
import type { WatchStopHandle } from 'vue'


const done = () => {
  for (const i in data.lightCone) {
    if (data.lightCone[i].details === undefined) {
      data.lightCone[i].details = getDetails()
    }
  }
  closeWindow('loading')
  clearTimeout(timeout)
  closeWindow('confirm')
  updateCheck()
}

// 数据库加载超时
const timeout = setTimeout(() => {
  openWindow('confirm', {
    title: '数据库加载异常',
    text: [
      '加载时间过长，可能是数据损坏',
      '点击<span style="color:red">确认</span>可以继续使用，但是可能出现功能异常'
    ],
    fn: () => {
      closeWindow('loading')
      updateCheck()
    }
  })
}, 30 * 1000)


const { needRefresh, updateServiceWorker } = useRegisterSW()
let updateWatcher: WatchStopHandle
const updateCheck = () => {
  nextTick(() => {
    if (!updateWatcher) {
      updateWatcher = watchEffect(() => {
        if (needRefresh.value) {
          openWindow('confirm', {
            title: '发现新版本',
            text: ['是否立刻更新？'],
            tip: '如果选择不更新将会在下次启动时自动更新',
            fn: () => {
              openWindow('loading')
              updateServiceWorker(true)
            }
          })
        }
      })
    }
  })
}

const loadDB = () => {
  new IndexedDB('sr-light-cone', '光锥')
    .add({
      data: data,
      key: 'lightCone',
      name: 'lightCone'
    })
    .next()
    .then(done)
    .catch((err) => {
      console.error(err)

      openWindow('confirm', {
        title: '数据库初始化失败',
        text: ['光锥编辑器可以正常使用', '但是数据可能丢失且不会被保存']
      })
    })
}

// 检查更新日志
const logCheck = () => {
  const lastUpdate = new Date(log[0].time).getTime()
  const localLastUpdate = Number(localStorage.getItem('sr-light-cone-time'))
  if (lastUpdate) {
    if (lastUpdate > localLastUpdate) {
      openWindow('log')
      localStorage.setItem('sr-light-cone-time', JSON.stringify(lastUpdate))
    }
  }
}

openWindow('loading')
loadDB()
logCheck()
