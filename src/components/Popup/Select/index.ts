export const selectData = reactive<{
  title: string
  list: string[] | readonly string[]
  select?: string
  fn?: () => void
}>({
  title: '',
  list: [],
  select: undefined,
  fn: undefined
})

export const selectOpen = <T extends string[] | readonly string[]>(
  title: string,
  list: T,
  defaultText?: string
) => {
  return new Promise<T[number] | undefined>((resolve) => {
    selectData.title = title
    selectData.list = list
    selectData.select = defaultText
    selectData.fn = () => {
      resolve(selectData.select)
    }
  })
}

export const selectClose = () => {
  selectData.title = ''
  selectData.list = []
  selectData.select = undefined
  selectData.fn = undefined
}
