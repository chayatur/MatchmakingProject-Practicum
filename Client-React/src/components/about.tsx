import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';

const About = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

    const handleRegisterClick = () => {
        if (isLoggedIn) {
            alert("כבר נרשמת? לחץ כאן כדי להתחבר."); // הודעה למשתמש
            navigate('/login'); // נווט לדף הלוגין
        } else {
            navigate('/register'); // נווט לדף ההרשמה
        }
    };

    return (
        <>
            <h2>לחיים-איתך לאורך הדרך🥂</h2>
            <p>
                אפליקציה זו נועדה לייעל את תהליך השידוכים על ידי ניהול שדכניות ושיתוף חיפוש בין משתמשים.
                אנו מספקים פלטפורמה נוחה להעלאת פרופילים, חיפוש שדכניות, ושיתוף מידע בממשק ידידותי.
                עם הכלים שלנו, תוכל לנהל את תהליך השידוך בצורה קלה ויעילה.
            </p>
            <button
                style={{
                    marginTop: '24px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #5e2b5e, #a65e9e, #b2e0b2, #99ff99)',
                    color: '#fff',
                    padding: '12px 24px',
                    fontSize: '18px',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.3)'
                }}
                onClick={handleRegisterClick}
            >
                <FaUserPlus /> רוצה להרשם גם? לחץ כאן
            </button>
        </>
    );
};

export default About;
