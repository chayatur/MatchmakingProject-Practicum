
import { useNavigate } from "react-router-dom"
import { FaUsers, FaShieldAlt, FaRocket, FaSearch, FaHandshake, FaClock } from "react-icons/fa"
import '../styles/about.css'

const About = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <FaSearch />,
      title: "חיפוש מתקדם",
      description: "מערכת חיפוש חכמה ומתקדמת המאפשרת למצוא את השידוך המושלם בקלות ובמהירות",
    },
    {
      icon: <FaShieldAlt />,
      title: "פרטיות מלאה",
      description: "אנו מתחייבים לשמור על פרטיותכם ולהגן על המידע האישי שלכם ברמה הגבוהה ביותר",
    },
    {
      icon: <FaUsers />,
      title: "קהילה תומכת",
      description: "קהילה חמה ותומכת של משפחות ורווקים המחפשים את השידוך הנכון",
    },
    {
      icon: <FaHandshake />,
      title: "ליווי אישי",
      description: "צוות מקצועי ומנוסה המלווה אתכם לאורך כל הדרך עד למציאת השידוך המושלם",
    },
    {
      icon: <FaRocket />,
      title: "טכנולוגיה מתקדמת",
      description: "שימוש בטכנולוגיות החדישות ביותר להתאמה מדויקת ויעילה",
    },
    {
      icon: <FaClock />,
      title: "זמינות 24/6",
      description: "המערכת זמינה 24 שעות ביממה, 6 ימים בשבוע לשירותכם",
    },
  ]

  const stats = [
    { number: "10,000+", label: "משפחות מרוצות" },
    { number: "5,000+", label: "שידוכים מוצלחים" },
    { number: "15+", label: "שנות ניסיון" },
    { number: "98%", label: "שביעות רצון" },
  ]

  const team = [
    {
      name: "רבקה כהן",
      role: "מנהלת השידוכים הראשית",
      description: "בעלת ניסיון של 20 שנה בתחום השידוכים, מתמחה בהתאמות מדויקות ומקצועיות",
      avatar: "ר",
    },
    {
      name: "שרה לוי",
      role: "יועצת שידוכים בכירה",
      description: "מומחית בליווי זוגות צעירים ובהכנה לחתונה, בעלת תואר בפסיכולוגיה",
      avatar: "ש",
    },
    {
      name: "מרים גולדברג",
      role: "רכזת קהילה",
      description: "אחראית על הקהילה והאירועים, יוצרת חיבורים משמעותיים בין המשפחות",
      avatar: "מ",
    },
  ]

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>אודות הפרויקט</h1>
          <p>
            מערכת ניהול שידוכים מתקדמת המיועדת לשדכנים מקצועיים
            <br />
            לניהול יעיל ובטוח של רזומות ומידע אישי
          </p>
        </div>
      </section>

      <div className="about-content">
        {/* Mission Section */}
        <section className="about-section">
          <div className="section-header">
            <h2>מטרת הפרויקט</h2>
            <p>
              הפרויקט נועד לספק פתרון טכנולוגי מתקדם לשדכנים מקצועיים לניהול רזומות ומידע אישי של לקוחותיהם. המערכת
              מאפשרת העלאה, עיבוד, חיפוש ושיתוף של רזומות בצורה יעילה ובטוחה, תוך שמירה על פרטיות המידע והקפדה על
              סטנדרטים גבוהים של אבטחת מידע. המערכת פועלת 24/6 ומספקת כלים מתקדמים לשיפור תהליך השידוכים.
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

        {/* Stats Section */}
        <section className="about-section stats-section">
          <div className="section-header">
            <h2>המספרים מדברים בעד עצמם</h2>
            <p>אנו גאים בהישגים שלנו ובאמון שמשפחות רבות נותנות בנו</p>
          </div>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="about-section team-section">
          <div className="section-header">
            <h2>הצוות שלנו</h2>
            <p>צוות מקצועי ומנוסה של יועצות שידוכים המתמחות בהתאמות מדויקות ובליווי אישי</p>
          </div>

          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-avatar">{member.avatar}</div>
                <div className="member-name">{member.name}</div>
                <div className="member-role">{member.role}</div>
                <div className="member-description">{member.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>    רוצים להיות חלק ?</h2>
            <p>הצטרפו אלינו היום ותתחילו את המסע שלכם למציאת השידוך המושלם</p>
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
