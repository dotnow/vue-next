<template>
  <Tree
    :value="categoriesList"
    selectionMode="multiple"
    :metaKeySelection="false"
    v-model:selectionKeys="selectedCategories"
    :expandedKeys="expandedCategories"
    @node-select="selectCategory"
    @node-unselect="unselectCategory"
  >
    <template #default="slotProps">
      <b>{{ slotProps.node.name }}</b>
    </template>
  </Tree>
</template>

<script>
import { computed, ref, onMounted, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  props: {
    filter: {
      type: Object,
      required: true
    },
    name: {
      type: String
    },
    categoryID: {
      type: String
    }
  },

  setup(props) {
    const store = useStore()
    const router = useRouter()

    const { name, categoryID, filter } = toRefs(props)
    const selectedCategories = ref(null)

    const setKeysAndChildren = item => ({
      ...item,
      key: item.id,
      children: store.getters['categories/getChildrens'](item.id).map(ch =>
        setKeysAndChildren(ch)
      )
    })

    const categories = computed(() =>
      store.getters['categories/all'].map(el => setKeysAndChildren(el))
    )

    const categoriesList = computed(() => [
      {
        key: 'all',
        name: 'Все',
        children: categories.value.filter(el => !el.parentID)
      }
    ])

    const expandedCategories = computed(() =>
      Object.fromEntries([
        ['all', true],
        ...categories.value.map(el => [[el.id], true])
      ])
    )

    const selectCategory = e => {
      if (filter.value['categoryID']) {
        filter.value['categoryID'].push(e.key)
      } else {
        filter.value['categoryID'] = [e.key]
      }
    }

    const unselectCategory = e => {
      filter.value['categoryID'] = filter.value['categoryID'].filter(
        el => el !== e.key
      )
    }

    watch(props, () => {
      let query = {}

      if (!filter.value['name']) {
        delete filter.value['name']
      } else {
        query['name'] = filter.value['name']
      }

      if (!filter.value['categoryID'] || !filter.value['categoryID'].length) {
        delete filter.value['categoryID']
      } else {
        query['categoryID'] = filter.value['categoryID'].join(',')
      }

      router.replace({ query })
    })

    onMounted(() => {
      if (name.value) {
        filter.value['name'] = name.value
      }
      if (categoryID.value) {
        filter.value['categoryID'] = categoryID.value.split(',')
        selectedCategories.value = Object.fromEntries([
          ...Object.values(filter.value['categoryID']).map(el => [[el], true])
        ])
      }
    })

    return {
      categoriesList,
      selectedCategories,
      expandedCategories,
      selectCategory,
      unselectCategory
    }
  }
}
</script>
