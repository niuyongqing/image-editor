import { reactive } from "vue";
import _ from "lodash";

function defaultClone(value) {
  if (value === null || typeof value !== "object") return value;
  return _.cloneDeep(value);
}
// 可以重置的reactive
export function useReseReactive(value) {
  const state = reactive(defaultClone(value));
  const reset = () => {
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, defaultClone(value));
  };
  return { state, reset };
}
