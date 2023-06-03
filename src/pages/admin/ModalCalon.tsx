import { React, useState, useEffect } from 'react';
import { IonModal, IonButton, IonHeader, IonToolbar, IonTitle, IonTextarea, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IonLoading,IonToast } from '@ionic/react';
import { faArrowLeft, faUserCircle, faUser, faUsers, faSave, faCheckCircle, faChartPie, faSignOut, faHome, faTimesCircle, faPencil } from '@fortawesome/free-solid-svg-icons';
import './Modal.css';
import axios from 'axios';

interface ModalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const ModalCalon: React.FC<ModalSheetProps> = ({ isOpen, onClose, data }) => {
  const [formData, setFormData] = useState({
    id: '',
    nama: '',
    kelas: '',
    moto: '',
    gambar: '',
  });

  const { id, nama, kelas, moto, gambar } = formData;
  const [showLoading, setShowLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [bgToast, setToastBg] = useState('');
  
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
	  setFormData({ ...formData, [event.target.name]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simpanData = () => {
	setShowLoading(true);
	const config = {
	  headers: {
		'Content-Type': 'multipart/form-data'
	  }
	};
    axios
      .post('https://evotingosis.musky.site/simpanCalon.php', formData, config)
      .then((response) => {
		  let a = response.data;
		  setToastMessage(a.msg);
		  if(a.success == true){
			setToastBg('success');
			setTimeout(() => {
				setShowToast(true);
			}, 500);
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		  }else{
			setToastBg('danger');
			setTimeout(() => {
				setShowLoading(false);
				setShowToast(true);
			}, 1000);
		  }
      })
      .catch((error) => {
		setShowLoading(false);
      });
  };

  const handleModalShow = () => {
	setTimeout(() => {
		setShowLoading(false);
	}, 1000);
    setFormData({
		id: data?.id,
		nama: data?.nama,
		kelas: data?.kelas,
		moto: data?.moto,
		gambar: data?.gambar,
    });
	setImagePreview(data?.gambar);
  };
  return (
    <IonModal onDidPresent={handleModalShow} isOpen={isOpen} cssClass="modal-sheet" clickToClose={true} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="judul">
            <FontAwesomeIcon icon={faPencil} /> {data?.judul}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form className="formaddubah" encType="multipart/form-data">
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              name="nama"
              value={nama}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Masukkan nama ..."
            />
          </div>
          <div className="form-group mt-2">
            <label>Kelas</label>
            <input
              type="text"
              name="kelas"
              value={kelas}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Masukkan kelas ..."
            />
          </div>
          <div className="form-group mt-2">
            <label>Moto</label>
            <textarea
              type="text"
              name="moto"
              value={moto}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Masukkan moto ..."
            ></textarea>
          </div>
          <div className="form-group mt-2">
            <label>Gambar</label>
            <input
              type="file"
              name="gambar"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
              placeholder="Pilih gambar ..."
            />
          </div>
          <div className="form-group mt-2">{imagePreview && <img src={imagePreview} alt="Preview" />}</div>
        </form>
      </IonContent>
      <button type="submit" onClick={simpanData} className="btn btn-success rounded-0">
        <FontAwesomeIcon icon={faSave} /> &nbsp; Simpan
      </button>
	  <IonLoading isOpen={showLoading} message={'Loading...'} />
	  <IonToast
	  	isOpen={showToast}
	  	message={toastMessage}
	  	duration={2000}
	  	onDidDismiss={() => setShowToast(false)}
	  	color={bgToast}
	  	style={{ width: '100%', padding:'5px', textAlign:'center'}}
	  />
    </IonModal>
  );
};

export default ModalCalon;
