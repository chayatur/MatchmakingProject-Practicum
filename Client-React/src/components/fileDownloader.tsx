import { Button, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { setLoading, setError } from '../slices/fileSlice';
import axios from 'axios';

const DownloadResume = ({ fileName }: { fileName: string }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleDownload = async () => {
        // טיפול בשגיאות: אם fileName חסר
        if (!fileName) {
            alert('שגיאה: לא ניתן להוריד את הקובץ.');
            return;
        }

        dispatch(setLoading(true));

        try {
            // בקשת ה-URL להורדת הקובץ
            const response = await axios.get(`https://matchmakingproject-practicum.onrender.com/api/Download_ShowFiles/download-url?fileName=${encodeURIComponent(fileName)}`);
            const downloadUrl = response.data.url;

            // הורדת הקובץ
            const fileResponse = await axios.get(downloadUrl, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // שם הקובץ להורדה
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); // לנקות את ה-URL שנוצר
        } catch (error: any) {
            // טיפול בשגיאות
            dispatch(setError(error.response?.data?.message || error.message));
            alert('אירעה שגיאה במהלך ההורדה: ' + (error.response?.data?.message || error.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Button
                variant="contained"
                onClick={handleDownload}
                startIcon={<DownloadIcon />}
            >
                הורד רזומה
            </Button>
        </Box>
    );
};

export default DownloadResume;
