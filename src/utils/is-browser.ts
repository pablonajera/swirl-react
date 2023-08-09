interface w extends Window {
  appEnvironment?: string
}

const IS_BROWSER =
  typeof window !== 'undefined' &&
  window &&
  (window as w).appEnvironment !== 'node'

export default IS_BROWSER
