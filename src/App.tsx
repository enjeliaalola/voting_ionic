import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import HomePemilih from './pages/pemilih/Home';
import BerandaPemilih from './pages/pemilih/Beranda';
import HasilVotingPemilih from './pages/pemilih/HasilVoting';
import ProfilePemilih from './pages/pemilih/Profile';

import BerandaAdmin from './pages/admin/Beranda';
import CalonAdmin from './pages/admin/Calon';
import PemilihAdmin from './pages/admin/Pemilih';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home"><HomePemilih /></Route>
        <Route exact path="/"><Redirect to="/home" /></Route>
        <Route exact path="/beranda"><BerandaPemilih /></Route>
        <Route exact path="/hasil"><HasilVotingPemilih /></Route>
        <Route exact path="/profile"><ProfilePemilih /></Route>
		
        <Route exact path="/berandaadmin"><BerandaAdmin /></Route>
        <Route exact path="/calonadmin"><CalonAdmin /></Route>
        <Route exact path="/pemilihadmin"><PemilihAdmin /></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
