// instantiate history object in
// its own module.  Then be able to use it
// in places other than just router-connected
// components (e.g. call history.push(myPath))
// in an action creator)

import createBrowserHistory from 'history/createBrowserHistory';

export default createBrowserHistory();