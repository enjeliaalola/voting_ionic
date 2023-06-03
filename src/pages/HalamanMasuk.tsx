import './HalamanMasuk.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { React, useState, useEffect } from 'react';
import { IonLoading,IonToast } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

interface ContainerProps { }

//Class untuk Halaman Login
const HalamanMasuk: React.FC<ContainerProps> = () => {
	const history = useHistory();
	const [showLoading, setShowLoading] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const [bgToast, setToastBg] = useState('');

	//Menyimpan Inputan Form kedalam State formData
	const [formData, setFormData] = useState({
	  username: '',
	  password: '',
	});

	const { username, password } = formData;
	//Menyimpan Inputan Form kedalam State formData pada saat pengguna Mengetik atau Mengisi
	const handleInputChange = (event) => {
	  setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	useEffect(() => {
		//Menghapus Data Login ketika mengakses halaman Login
		localStorage.removeItem('user_id');
		localStorage.removeItem('user_name');
		localStorage.removeItem('user_nama');
		localStorage.removeItem('user_jenis');
	}, []);
  
	const masukAplikasi = (e) => {
		setShowLoading(true);
		const config = {
		  headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		  }
		};
		//Mengecek Data Login yang ada di Server, apakah data sesuai atau tidak
		axios.post('https://evotingosis.musky.site/masuk.php', formData, config)
			.then(response => {
			  let a = response.data;
			  setToastMessage(a.msg);
			  if(a.success == true){
				setToastBg('success');
				//Menyimpan Data Informasi Login ketika Sukses Login
				localStorage.setItem('user_id', a.user_id);
				localStorage.setItem('user_name', a.user_name);
				localStorage.setItem('user_nama', a.user_nama);
				localStorage.setItem('user_jenis', a.user_jenis);
				localStorage.setItem('total_calon', a.total_calon);
				localStorage.setItem('total_pemilih', a.total_pemilih);
				localStorage.setItem('sudah_memilih', a.sudah_memilih);
				setTimeout(() => {
					setShowToast(true);
				}, 1000);
				setTimeout(() => {
					setShowLoading(false);
					if(a.user_jenis == 'admin'){
						//Mengalihkan pengguna kehalaman Admin jika Jenis User Loginnya berupa Admin
						history.push('/berandaadmin');
					}else{
						//Mengalihkan pengguna kehalaman Pemilih jika Jenis User Loginnya berupa Pemilih
						history.push('/beranda');
					}
				}, 1250);
			  }else{
				setToastBg('danger');
				setTimeout(() => {
					setShowLoading(false);
					setShowToast(true);
				}, 1000);
			  }
			})
			.catch(error => {
				setTimeout(() => {
					setShowLoading(false);
				}, 3000);
				console.error(error);
			});
		  e.preventDefault();
		};
  return (
	// Form Halaman Login
    <div className="container">
		<div className="Auth-form-container">
		  <form className="Auth-form" onSubmit={masukAplikasi}>
			<div className="Auth-form-content">
				<div className="logodiv">
				   <img className="logo" src={'./favicon.png'} alt="Logo Aplikasi" />
			    </div>
			  <h3 className="Auth-form-title  text-left">Aplikasi eVoting</h3>
			  <p className="deskripsi">
				Selamat datang di Aplikasi eVoting Pemilihan Ketua Osis, Masukkan Username dan Password pada form berikut.
			  </p>
			  <div className="form-group mt-3">
				<label>Username</label>
				<input
				  type="text"
				  name="username"
				  value={username}
				  onChange={handleInputChange}
				  className="form-control mt-1"
				  placeholder="Masukkan username ..."
				/>
			  </div>
			  <div className="form-group mt-3">
				<label>Password</label>
				<input
				  type="password"
				  name="password"
				  value={password}
				  onChange={handleInputChange}
				  className="form-control mt-1"
				  placeholder="Masukkan password ..."
				/>
			  </div>
			  <div className="d-grid gap-2 mt-3">
				<button type="submit" className="btn btn-primary">
				  Masuk ke Aplikasi
				</button>
			  </div>
			  <p className="forgot-password text-right mt-2">
				Belum Punya Akun? <a href="#">Hubungi Admin</a>
			  </p>
			</div>
		  </form>
		</div>
		
		<IonLoading isOpen={showLoading} message={'Loading...'} />
		<IonToast
			isOpen={showToast}
			message={toastMessage}
			duration={2000}
			onDidDismiss={() => setShowToast(false)}
			color={bgToast}
			style={{ width: '100%', padding:'5px', textAlign:'center'}}
		/>
	</div>
  );
};

export default HalamanMasuk;
