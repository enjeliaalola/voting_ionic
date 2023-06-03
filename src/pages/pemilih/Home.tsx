import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import HalamanMasuk from '../HalamanMasuk';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Halaman Utama</IonTitle>
          </IonToolbar>
        </IonHeader>
        <HalamanMasuk />
      </IonContent>
    </IonPage>
  );
};

export default Home;
