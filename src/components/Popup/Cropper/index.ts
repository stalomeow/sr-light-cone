import { imageCompress } from '@/utils/scripts/images'
import { SuperImageCropper } from 'super-image-cropper'

export const imageCropper = new SuperImageCropper()

export const cropperSetting = reactive<{
  img: string
  aspectRatio?: number
  fn?: (img: string) => void
}>({
  img: ''
})

const cropperOpen = (img: string, aspectRatio?: number) => {
  return new Promise<string>((resolve) => {
    cropperSetting.img = img
    cropperSetting.aspectRatio = aspectRatio
    cropperSetting.fn = (str) => resolve(str)
  })
}

export const cropperCallback = {
  open: (config?: { aspectRatio?: number; maxWidth?: number }) => {
    return new Promise<{ base64: string; raw: File }>((resolve) => {
      const el = document.createElement('input')
      el.type = 'file'
      el.accept = 'image/*'
      el.onchange = async () => {
        if (el.files?.[0]) {
          resolve({
            base64: await cropperOpen(
              await imageCompress(el.files[0], config?.maxWidth),
              config?.aspectRatio
            ),
            raw: el.files[0]
          })
        }
      }
      el.click()
    })
  },
  close: () => {
    cropperSetting.img = ''
    cropperSetting.aspectRatio = undefined
    cropperSetting.fn = undefined
  },
  confirm: () => {}
}
