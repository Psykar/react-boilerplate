import {
  ADD_TAB,
} from '../actions'


export function aReducer(state = {}, action) {
  switch (action.type) {
    case ADD_TAB:
      return {tabAdded: true}
  }
  return state
}
