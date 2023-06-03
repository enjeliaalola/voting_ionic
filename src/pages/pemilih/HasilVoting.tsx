import React, { useEffect, useState } from 'react';
import {
	IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCardContent, IonLoading, IonToast,
	IonCardHeader, IonCardSubtitle, IonCardTitle, IonList, IonItem, IonLabel
} from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faUserCircle,faUser,faCheckCircle,faChartPie,faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import './Home.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface HasilVotingProps { }

const Beranda: React.FC<HasilVotingProps> = () => {
	const history = useHistory();
	const [showLoading, setShowLoading] = useState(false);
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
	const [values, setValues] = useState([]);
	const [labels, setLabels] = useState([]);
	const [warna, setwarna] = useState([]);
	
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
	
	const fetchData = async () => {
		try {
			setShowLoading(true);
			const response = await axios.get('https://evotingosis.musky.site/getGrafik.php');
			let a = response.data;
			
			// Mendapatkan data dan label dari response
			const dataValues = a.map((item) => item.hasil);
			const labelValues = a.map((item) => item.nama);
			const dataWarna = a.map((item) => item.warna);
	
			// Memperbarui state data dan labels
			setData(a);
			setValues(dataValues);
			setLabels(labelValues);
			setwarna(dataWarna);
	  
			setTimeout(() => {
				setShowLoading(false);
			}, 1000);
		} catch (error) {
			setTimeout(() => {
				setShowLoading(false);
			}, 3000);
		}
	};
	
	const dataGrafik = {
	  labels: labels,
	  datasets: [
		{
			data: values,
			backgroundColor: warna,
			hoverBackgroundColor: warna,
		},
	  ],
	};

	const options = {
		 layout: {
		   padding: {
			top: 15,
		   },
		 },
		plugins: {
		  legend: {
			display: true,
			position: 'bottom',
		  },
		  datalabels: {
			color: 'white',
			font: {
			  weight: 'bold',
			  size: 16,
			},
			formatter: (value, ctx) => {
			  let sum = 0;
			  let dataArr = ctx.chart.data.datasets[0].data;
			  dataArr.map((data) => {
				sum += data*1;
				return sum;
			  });
			  let percentage = ((value * 100) / sum).toFixed(2) + '%';
			  //return `${ctx.chart.data.labels[ctx.dataIndex]}\n${percentage} (${value})`;
			  return `${percentage} (${value})`;
			},
		  },
		  tooltip: {
			callbacks: {
			  label: (context) => {
				const dataset = context.dataset;
				const index = context.dataIndex;
				const total = dataset.data.reduce((previousValue, currentValue) => previousValue + currentValue)*1;
				const currentValue = dataset.data[index];
				let sum = 0;
				let dataArr = dataset.data;
				  dataArr.map((data) => {
					sum += data*1;
					return sum;
				  });
			  
				const percentage = ((currentValue * 100) / sum).toFixed(2);
				return `${labels[index]}: ${currentValue} (${percentage}%)`;
			  },
			},
		  },
		}
	};
  const altText = "Calon Ketua Osis atas nama";
  return (
    <IonPage className = "overflow-auto">
		<IonHeader>
			<IonToolbar>
			  <div className="d-flex justify-content-between align-items-center headerpage">
				<div onClick={kembaliHistory}><FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Hasil Voting Calon Ketua Osis</div>
			  </div>
			</IonToolbar>
		</IonHeader>
		<IonContent>
			<Pie data={dataGrafik} options={options} />
			<div className="judulhasil mt-3 text-center p-3">
				Berikut ini adalah hasil dari eVoting masing-masing calon Ketua Osis
			</div>
			<IonList>
				{data.map((item) => (
					<div className="mb-2" key={item.id}>
					  <img alt={altText+item.nama} src={item.gambar} />
					  <IonCardHeader className="m-0 p-0">
						<IonCardTitle className="h2">{item.nama}</IonCardTitle>
					  </IonCardHeader>
					  <div className="d-flex justify-content-between align-items-center aksihasil">
						<button className="btn btn-success" style={{backgroundColor:item.warna,borderColor:item.warna}}>
						  Hasil Voting : {item.hasil} (Suara)
						</button>
					  </div>
					</div>
				))}
			</IonList>
		</IonContent>
		<IonLoading isOpen={showLoading} message={'Loading...'} />
    </IonPage>
  );
};

export default Beranda;
