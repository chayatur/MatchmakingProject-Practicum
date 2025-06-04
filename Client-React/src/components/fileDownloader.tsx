import React from 'react';
import { Button, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import axios from 'axios';
import { setLoading, setError } from '../slices/fileSlice';

const DownloadResume: React.FC<{ fileId: number; fileName: string }> = ({ fileId, fileName }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleDownload = async () => {
        // טיפול בשגיאות: אם fileId או fileName חסרים
        if (!fileName) {
            alert('שגיאה: לא ניתן להוריד את הקובץ.');
            return;
        }

        dispatch(setLoading(true));

        try {
   
            const response = await axios.get(`http://localhost:5138/api/Download_ShowFiles/download-url?fileName=${fileName}`, {
                responseType: "blob",
            });

            // בדוק אם הסטטוס הוא 200
            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                alert('שגיאה: ' + response.data.message);
            }
        } catch (error: any) {
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
