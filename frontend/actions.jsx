export const ADD_TAB = 'ADD_TAB'

export function addTab(tab) {
  return {
    type: ADD_TAB,
    tab: tab,
  }
}
