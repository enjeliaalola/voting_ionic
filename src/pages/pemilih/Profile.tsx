import React, { useEffect, useState } from 'react';
import {
	IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCardContent, IonLoading, IonToast,
	IonCardHeader, IonCardSubtitle, IonCardTitle, IonList, IonItem, IonLabel
} from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faUserCircle,faUser,faCheckCircle,faChartPie,faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useHistory,useLocation } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import './Home.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface ProfileProps { }

const Profile: React.FC<ProfileProps> = () => {
	const history = useHistory();
	const [showLoading, setShowLoading] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const [bgToast, setToastBg] = useState('');
	
	useEffect(() => {
		if (localStorage.getItem('user_name') === null) {
			history.replace('/home');
			setTimeout(() => {
				window.location.reload();
			}, 100);
		} else {
			fetchData();
		}
	}, []);
	
	const keluarAplikasi = (e) => {
		history.replace('/home');
		setTimeout(() => {
			window.location.reload();
		}, 100);
	};
	const kembaliHistory = (e) => {
		history.goBack();
		setTimeout(() => {
			window.location.reload();
		}, 100);
	};
	const [data, setData] = useState([]);
	const location = useLocation();
	
	const fetchData = async () => {
		try {
			setShowLoading(true);
			const id = location.state;
			const config = {
			  headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			  }
			};
			await axios.post('https://evotingosis.musky.site/getData.php', {id:id.dataParam}, config)
				.then(response => {
					let a = response.data;
					setData(a);
					setTimeout(() => {
						setShowLoading(false);
					}, 1000);
				})
				.catch(error => {
					setTimeout(() => {
						setShowLoading(false);
					}, 3000);
				});
		} catch (error) {
			setTimeout(() => {
				setShowLoading(false);
			}, 3000);
		}
	};
	
	const votingSekarang = (id) => {
		try {
			setShowLoading(true);
			const config = {
			  headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			  }
			};
			axios.post('https://evotingosis.musky.site/votingSekarang.php', {id_calon:id,id_pemilih:localStorage.getItem('user_id')}, config)
				.then(response => {
					let a = response.data;
					setToastMessage(a.msg);
					setToastBg('dark');
					setTimeout(() => {
						setShowToast(true);
						setShowLoading(false);
					}, 1000);
				})
				.catch(error => {
					setTimeout(() => {
						setShowLoading(false);
					}, 3000);
				});
		} catch (error) {
			setTimeout(() => {
				setShowLoading(false);
			}, 3000);
		}
	};
	
  const altText = "Calon Ketua Osis atas nama";
  return (
    <IonPage className = "overflow-auto">
		<IonHeader>
			<IonToolbar>
			  <div className="d-flex justify-content-between align-items-center headerpage">
				<div onClick={kembaliHistory}><FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Profile Data Calon</div>
			  </div>
			</IonToolbar>
		</IonHeader>
		<IonContent>
			<IonList>
				{data.map((item) => (
					<div className="mb-2" key={item.id}>
					  <img alt={altText+item.nama} src={item.gambar} />
					  <IonCardHeader>
						<IonCardTitle>{item.nama}</IonCardTitle>
						<IonCardSubtitle>Kelas : {item.kelas}</IonCardSubtitle>
					  </IonCardHeader>
					  <IonCardContent>Moto : {item.moto}</IonCardContent>
					  <div className="d-flex justify-content-between align-items-center aksihasil">
						<button className="btn btn-success" onClick={() => votingSekarang(item.id)}>
						  <FontAwesomeIcon icon={faCheckCircle} /> Voting Calon Disini
						</button>
					  </div>
					</div>
				))}
			</IonList>
		</IonContent>
		<IonLoading isOpen={showLoading} message={'Loading...'} />
		<IonToast
			isOpen={showToast}
			message={toastMessage}
			duration={2000}
			onDidDismiss={() => setShowToast(false)}
			color={bgToast}
			style={{ width: '100%', padding:'5px', textAlign:'center'}}
		/>
    </IonPage>
  );
};

export default Profile;
