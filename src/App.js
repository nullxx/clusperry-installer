import { Offline, Online } from 'react-detect-offline';

import OfflineComponent from './pages/offline';
import React from 'react';
import Welcome from './pages/welcome';

const App = () => (
  <>
    <Online>
      <Welcome />
    </Online>
    <Offline>
      <OfflineComponent />
    </Offline>
  </>
);
export default App;
