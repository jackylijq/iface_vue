import { computed,unref } from 'vue'
import store from '../../store/index'
export function useUser() {
  let computedUid = computed(() => store.getters.user?.id)
  return {
    uid: unref(computedUid),
  }
}
