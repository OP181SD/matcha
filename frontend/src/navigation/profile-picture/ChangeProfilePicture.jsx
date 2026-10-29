import api from '../../utils/api.js';
import axios from 'axios';

export const handleUploadToCloudinary = async (file, setUser) => {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "matcha");

    try {
        const res = await axios.post("https://api.cloudinary.com/v1_1/dunrzye1v/image/upload", formData);
        const imageUrl = res.data.secure_url;


        const saved = await api.post("/api/add-picture", { imageUrl });
        setUser(prev => ({ ...prev, photos: [...prev.photos, saved.data.picture] }));
    } catch (err) {
    }
};