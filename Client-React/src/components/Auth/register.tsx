import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { User } from '../../types/user';
import { registerUser } from '../../slices/userSlice';

const Register = () => {
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const { control, handleSubmit, formState: { errors, isValid } } = useForm<User>({ mode: "onChange" });
    const [msg, setMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(true);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (isLoggedIn) {
            setMsg("כבר נרשמת? לחץ כאן כדי להתחבר.");
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const onSubmit = async (data: User) => {
        setLoading(true);
        setMsg("");

        try {
            const res = await dispatch(registerUser(data)).unwrap();
            setMsg("ההרשמה בוצעה בהצלחה!");
            navigate("/FileUploader");
        } catch (error) {
            setMsg("שגיאה בהרשמה, נסה שוב.");
        } finally {
            setLoading(false);
        }
    };

    function renderTextField(name: keyof User, label: string, rules: any) {
        return (
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label={label}
                        variant="outlined"
                        fullWidth
                        error={!!errors[name]}
                        helperText={errors[name]?.message}
                    />
                )}
            />
        );
    }

    return (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>הרשמה</DialogTitle>
            <DialogContent>
                <Box sx={{ width: 400, padding: 3 }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        הרשמה
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {renderTextField("username", "שם משתמש", { required: "שם משתמש נדרש" })}
                        {renderTextField("email", "מייל", {
                            required: "מייל נדרש",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "מייל לא תקין"
                            }
                        })}
                        {renderTextField("passwordHash", "סיסמא", {
                            required: "סיסמא נדרשת",
                            minLength: {
                                value: 4,
                                message: "הסיסמא חייבת להיות לפחות 4 תוים"
                            }
                        })}
                        {renderTextField("address", "כתובת", {})}
                        {renderTextField("phone", "טלפון", {})}
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#1565c0" } }}
                            disabled={!isValid || loading}
                        >
                            {loading ? "ביצוע הרשמה..." : "שלח"}
                        </Button>
                    </form>
                    {msg && (
                        <Typography variant="body2" color="error" align="center">
                            {msg}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default Register;
