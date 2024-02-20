import {defineStore} from "pinia";

export const usePageStore = defineStore('page', {
    state: () => ({
        title: null
    }),
    getters: {
      getTitlePage: (state) => state.title || ''
    },
    actions: {
        setTitlePage(payload) {
            this.title = payload
        }
    }
})