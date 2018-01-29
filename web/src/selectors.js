import {createSelector} from 'reselect';
import _values from 'lodash/values';
import _sortBy from 'lodash/sortBy';
import _orderBy from 'lodash/orderBy';


const stateSelector = createSelector(
  (state, params) => state,
  state => state,
)

const getUi = createSelector(
  (state, params = {}) => {
    return state.ui
  },
  ui => ui,
)



const getSnackbar = createSelector(
  (state, params = {}) => {
    return state.ui.snackbar;
  },
  snackbar => snackbar,
)

const getNavDrawer = createSelector(
  (state, params = {}) => {
    return state.ui.navDrawer;
  },
  navDrawer => navDrawer,
)

const getHeader = createSelector(
  (state, params = {}) => {
    return state.ui.header;
  },
  header => header,
)


const getTopic = createSelector(
  (state, params = {}) => {
    const topic_id = parseInt(params.topic_id, 10)
    return state.topics.cache[params.topic_id];
  },
  topic => topic,
)

const getTopics = createSelector(
  (state, params = {}) => {
    // todo: allow for different sorting criteria
    // to be passed as params
    const {sortCriteria} = params;

    const cache = state.topics.cache;
    const asArray = _values(cache);
    let sorted = [];

    if (sortCriteria === 'votes') {
      // sorting by basic algorithm below so
      // that items rearrange themselves
      sorted = _orderBy(asArray, (e) => e.votes.up - e.votes.down + 0.25 * e.votes.meh, ['desc'])
    }
    else {
      sorted = _orderBy(asArray, ['created_on'], ['asc']);
    }
    return sorted;
  },
  topics => topics,
)



export {
  getUi,
  getSnackbar,
  getNavDrawer,
  getHeader,
  getTopics,
  getTopic,
}