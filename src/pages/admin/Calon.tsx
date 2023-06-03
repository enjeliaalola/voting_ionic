import React, { useEffect, useState } from 'react';
import {
	IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCardContent, IonLoading, IonToast,
	IonCardHeader, IonCardSubtitle, IonCardTitle, IonList, IonItem, IonLabel
} from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faUserCircle,faUser,faUsers,faCheckCircle,faPlusCircle,faChartPie,faSignOut,faHome,faTimesCircle,faPencil } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChartPie from './ChartPie';
import Modal from './ModalCalon';

import './Admin.css';

interface CalonProps { }
const Calon: React.FC<CalonProps> = () => {
	const history = useHistory();
	const [showLoading, setShowLoading] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const [bgToast, setToastBg] = useState('');
	const [modalData, setModalData] = useState<any>(null);
	
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
		localStorage.removeItem('user_id');
		localStorage.removeItem('user_name');
		localStorage.removeItem('user_nama');
		localStorage.removeItem('user_jenis');
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
	const lihatCalon = (e) => {
		history.push('/calonadmin');
	};
	const lihatBeranda = (e) => {
		history.push('/berandaadmin');
	};
	const lihatPemilih = (e) => {
		history.push('/pemilihadmin');
	};
	const lihatHasil = (e) => {
		history.push('/hasil');
	};
	const lihatProfile = (id) => {
		history.push({
			pathname: '/profile',
			state: { dataParam: id },
		});
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
	const hapusData = (id) => {
		try {
			setShowLoading(true);
			const config = {
			  headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			  }
			};
			axios.post('https://evotingosis.musky.site/hapusData.php', {id:id,tMaster:'calon'}, config)
				.then(response => {
					let a = response.data;
					setToastMessage(a.msg);
					setToastBg('dark');
					setTimeout(() => {
						window.location.reload();
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
	const [data, setData] = useState([]);
	
	const fetchData = async () => {
		try {
			setShowLoading(true);
			const response = await axios.get('https://evotingosis.musky.site/getData.php');
			let a = response.data;
			setData(a);
			localStorage.setItem('total_calon', a[0].total_calon);
			localStorage.setItem('total_pemilih', a[0].total_pemilih);
			localStorage.setItem('sudah_memilih', a[0].sudah_memilih);
			setTimeout(() => {
				setShowLoading(false);
			}, 1000);
		} catch (error) {
			setTimeout(() => {
				setShowLoading(false);
			}, 3000);
		}
	};
	
	const [showModal, setShowModal] = useState(false);
	const openModal = (id,nama,kelas,moto,gambar) => {
		setShowModal(true);
		setShowLoading(true);
		setModalData({
		  id: id,
		  nama: nama,
		  kelas: kelas,
		  moto: moto,
		  gambar: gambar,
		  aksi: 'Tambah',
		  judul: 'Tambah Data '+nama
		});
		setTimeout(() => {
			setShowLoading(false);
		}, 1000);
	};
	
	const closeModal = () => {
		setShowModal(false);
	};
	const altText = "Calon Ketua Osis atas nama";
  return (
    <IonPage className = "overflow-auto">
		<Modal isOpen={showModal} onClose={closeModal} data={modalData} />
		<IonHeader>
			<IonToolbar>
			  <div className="d-flex justify-content-between align-items-center headerpage">
				<div onClick={kembaliHistory}><FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Daftar Calon Ketua Osis</div>
			  </div>
			</IonToolbar>
		</IonHeader>
		<IonContent>
			<div className="calon mt-3">
				<h5 className="judulteks"><FontAwesomeIcon icon={faUser} /> Daftar Calon Ketua Osis</h5>
				<IonList>
					{data.map((item) => (
						<div className="mb-2" key={item.id}>
						  <img alt={altText+item.nama} src={item.gambar} />
						  <IonCardHeader>
							<IonCardTitle>{item.nama}</IonCardTitle>
							<IonCardSubtitle>Kelas : {item.kelas}</IonCardSubtitle>
						  </IonCardHeader>
						  <IonCardContent>Moto : {item.moto}</IonCardContent>
						  <div className="d-flex gap-2 mt-3 p-1 justify-content-between align-items-center aksicalon">
							<button className="btn btn-danger" onClick={() => hapusData(item.id)}>
							  <FontAwesomeIcon icon={faTimesCircle} /> Hapus
							</button>
							<button className="btn btn-primary" onClick={() => openModal(item.id,item.nama,item.kelas,item.moto,item.gambar)}>
							  <FontAwesomeIcon icon={faPencil} /> Ubah
							</button>
						  </div>
						</div>
					))}
				</IonList>
			</div>
		</IonContent>
		<ion-footer>
		  <div className="d-flex justify-content-between align-items-center hasil">
			<button className="btn btn-success" onClick={() => openModal('','','','','')}>
			  <FontAwesomeIcon icon={faPlusCircle} /> Tambah Calon Ketua Osis
			</button>
		  </div>
		</ion-footer>
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

export default Calon;
