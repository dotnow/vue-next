const context = require.context('./', true, /index.js/)

const modules = {}

context.keys().forEach(file => {
  const moduleName = file.replace(/(\.\/|\/index.js)/g, '')
  modules[moduleName] = context(file).default || context(file)
  modules[moduleName].namespaced = true
})

export default modules
