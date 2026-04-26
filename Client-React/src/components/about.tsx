
import { useNavigate } from "react-router-dom"
import { FaSearch, FaShieldAlt, FaRobot, FaShareAlt, FaFileUpload, FaUsersCog } from "react-icons/fa"
import '../styles/about.css'

const About = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <FaFileUpload />,
      title: "העלאת רזומות",
      description: "העלאת קבצי PDF ו-DOCX בגרירה ושחרור, עם מעקב התקדמות בזמן אמת",
    },
    {
      icon: <FaRobot />,
      title: "ניתוח AI חכם",
      description: "המערכת מנתחת את הרזומה אוטומטית באמצעות GPT-4o ומחלצת שם, גיל, גובה, עיסוק, מקום לימודים ועוד",
    },
    {
      icon: <FaSearch />,
      title: "חיפוש וסינון מתקדם",
      description: "סינון רזומות לפי שם, כתובת, גיל, גובה, עיסוק ומקום לימודים — עם עדכון תוצאות חי תוך כדי הקלדה",
    },
    {
      icon: <FaShareAlt />,
      title: "שיתוף בין שדכנים",
      description: "שדכן יכול לשתף רזומות עם שדכנים אחרים במערכת, לצפות ולהוריד בקלות",
    },
    {
      icon: <FaUsersCog />,
      title: "ממשק ניהול",
      description: "ממשק Angular נפרד למנהלים לניהול משתמשים, רזומות והרשאות במערכת",
    },
    {
      icon: <FaShieldAlt />,
      title: "אבטחה ופרטיות",
      description: "אימות JWT, אחסון מוצפן ב-AWS S3 ובקרת גישה מלאה לפי משתמש",
    },
  ]

  const techStack = [
    { label: "צד לקוח", value: "React + Redux Toolkit + MUI" },
    { label: "ממשק ניהול", value: "Angular" },
    { label: "שרת", value: ".NET ASP.NET Core" },
    { label: "בסיס נתונים", value: "SQL Server + Entity Framework" },
    { label: "אחסון קבצים", value: "AWS S3" },
    { label: "בינה מלאכותית", value: "OpenAI GPT-4o-mini" },
  ]

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>אודות הפרויקט</h1>
          <p>
            מערכת ניהול שידוכים מתקדמת — פרויקט פרקטיקום
            <br />
            כלי מקצועי לשדכנים לניהול רזומות בעזרת בינה מלאכותית
          </p>
        </div>
      </section>

      <div className="about-content">
        {/* Mission Section */}
        <section className="about-section">
          <div className="section-header">
            <h2>מטרת הפרויקט</h2>
            <p>
              הפרויקט פותח כפרויקט גמר לתואר מהנדס תוכנה. המטרה היא לספק לשדכנים מקצועיים כלי דיגיטלי מלא לניהול
              רזומות של מועמדים לשידוכים. המערכת מאפשרת העלאת קבצים, ניתוח אוטומטי בעזרת AI, חיפוש מהיר, שיתוף בין
              שדכנים וממשק ניהול נפרד — הכל תחת גג אחד, בצורה מאובטחת ויעילה.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="about-section stats-section">
          <div className="section-header">
            <h2>ערימת הטכנולוגיה</h2>
            <p>הפרויקט בנוי בארכיטקטורת שלוש שכבות עם טכנולוגיות מובילות בתעשייה</p>
          </div>

          <div className="stats-grid">
            {techStack.map((item, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number" style={{ fontSize: "1rem", lineHeight: 1.4 }}>{item.value}</div>
                <div className="stat-label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Section */}
        <section className="about-section team-section">
          <div className="section-header">
            <h2>איך המערכת עובדת?</h2>
            <p>תהליך פשוט ויעיל מקצה לקצה</p>
          </div>

          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">1</div>
              <div className="member-name">העלאת רזומה</div>
              <div className="member-role">PDF או DOCX</div>
              <div className="member-description">השדכן מעלה קובץ רזומה של מועמד. הקובץ נשמר ב-AWS S3 באופן מאובטח.</div>
            </div>
            <div className="team-member">
              <div className="member-avatar">2</div>
              <div className="member-name">ניתוח AI</div>
              <div className="member-role">GPT-4o-mini</div>
              <div className="member-description">המערכת שולחת את תוכן הרזומה ל-AI שמחלץ אוטומטית את כל הפרטים לתוך מסד הנתונים.</div>
            </div>
            <div className="team-member">
              <div className="member-avatar">3</div>
              <div className="member-name">חיפוש ושיתוף</div>
              <div className="member-role">בין שדכנים</div>
              <div className="member-description">השדכן מחפש רזומות לפי פרמטרים ויכול לשתף רזומות עם עמיתים לצורך התאמה.</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>רוצים להתחיל?</h2>
            <p>הירשמו למערכת והתחילו לנהל רזומות בצורה חכמה ומהירה</p>
            <button className="cta-button" onClick={() => navigate("/register")}>
              הצטרפו עכשיו
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
