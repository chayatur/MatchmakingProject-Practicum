import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField, Button, CircularProgress, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';

// הגדרת סכמת האימות
const validationSchema = Yup.object().shape({
    email: Yup.string().email('מייל לא תקין').required('מייל הוא שדה חובה'),
    password: Yup.string().required('סיסמה היא שדה חובה'),
});

const LoginForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, msg } = useSelector((state: RootState) => state.user);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const handleLogin = async (formData: { email: string; password: string; }) => {
        const resultAction = await dispatch(loginUser(formData));
        if (loginUser.fulfilled.match(resultAction)) {
            // אם הכניסה הצליחה, נווט לדף הבא
            navigate("/FileUploader");
        } else {
            // טיפול בשגיאה במקרה שהכניסה נכשלה
            const errorMsg = resultAction.error.message || 'שגיאה בכניסה, נסה שוב.';
            // כאן אפשר גם לעדכן את הודעת השגיאה ב-state של Redux אם יש צורך
        }
    };

    return (
        <form onSubmit={handleSubmit(handleLogin)}>
            <TextField
                label="מייל"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                margin="normal"
            />
            <TextField
                label="סיסמה"
                type="password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'שלח'}
            </Button>
            {msg && <Typography color="error">{msg}</Typography>} {/* הודעת שגיאה */}
        </form>
    );
};

export default LoginForm;
