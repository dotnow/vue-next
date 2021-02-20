import { dbService, transfrom } from './init'
import store from '@/store'

// Промокоды
const promocodesRef = dbService.ref('promocodes')

promocodesRef.on('child_added', data => {
  store.commit('promocodes/PROMOCODE_ADD', transfrom(data))
})

promocodesRef.on('child_changed', data => {
  store.commit('promocodes/PROMOCODE_UPDATE', transfrom(data))
})

promocodesRef.on('child_removed', data =>
  store.commit('promocodes/PROMOCODE_REMOVE', data.key)
)

export { promocodesRef }
