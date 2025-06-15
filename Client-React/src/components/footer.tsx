import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa"
import {
  IconButton,
  Collapse,
} from "@mui/material"
import { Email, ExpandMore, ExpandLess } from "@mui/icons-material"
import "../styles/footer.css"

const Footer = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [newsletterOpen, setNewsletterOpen] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter subscription:", email)
    setEmail("")
    alert("תודה על ההרשמה לניוזלטר!")
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-container">
      <div className="footer-wave"></div>

      <div className="footer-content">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon"><FaHeart /></div>
              <div className="logo-text">lechaim</div>
            </div>
            <p className="footer-description">
              אנו מתמחים ביצירת קשרים משמעותיים ובניית משפחות מאושרות. עם ניסיון של שנים רבות ומחויבות מלאה לכל לקוח,
              אנו כאן כדי לעזור לכם למצוא את השידוך המושלם.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" className="social-link" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="social-link" aria-label="WhatsApp"><FaWhatsapp /></a>
              <a href="#" className="social-link" aria-label="YouTube"><FaYoutube /></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          {/* Links */}
          <div className="footer-section">
            <h3>קישורים מהירים</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={() => navigate("/")}>דף הבית</a></li>
              <li><a href="#" onClick={() => navigate("/about")}>אודותינו</a></li>
              <li><a href="#" onClick={() => navigate("/resumes")}>רזומות</a></li>
              <li><a href="#" onClick={() => navigate("/profile")}>פרופיל אישי</a></li>
              {/* <li><a href="#" onClick={() => navigate("/dashboard")}>לוח בקרה</a></li> */}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3>השירותים שלנו</h3>
            <ul className="footer-links">
              <li><a href="#">שידוכים אישיים</a></li>
              <li><a href="#">ייעוץ זוגי</a></li>
              <li><a href="#">אירועי היכרות</a></li>
              <li><a href="#">הכנה לחתונה</a></li>
              {/* <li><a href="#">ליווי משפחתי</a></li> */}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="footer-section">
            <h3>יצירת קשר</h3>
            <ul className="contact-info">
              <li><FaPhone /><span>03-1234567</span></li>
              <li><FaWhatsapp /><span>050-1234567</span></li>
              <li><FaEnvelope /><span>lechyim@shiduchim-plus.co.il</span></li>
              {/* <li><FaMapMarkerAlt /><span>תל אביב, ישראל</span></li> */}
            </ul>

            {/* Newsletter Toggle */}
            <div className="newsletter">
              <IconButton onClick={() => setNewsletterOpen(!newsletterOpen)} sx={{ color: "#8B0000", fontSize: "1rem" }}>
                <Email /> &nbsp;
                {newsletterOpen ? <ExpandLess /> : <ExpandMore />} Subscribe to the newsletter
              </IconButton>

              <Collapse in={newsletterOpen}>
                <div className="newsletter-form-area">
                  <p>קבלו עדכונים על אירועים חדשים וטיפים לשידוכים</p>
                  <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                    <input
                      type="email"
                      className="newsletter-input"
                      placeholder="הכניסו את כתובת המייל"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="newsletter-button">
                      הירשמו עכשיו
                    </button>
                  </form>
                </div>
              </Collapse>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © {currentYear} lechaim. כל הזכויות שמורות. נבנה באהבה ומסירות.
          </div>
          <div className="footer-legal">
            <a href="#">תנאי שימוש</a>
            <a href="#">מדיניות פרטיות</a>
            <a href="#">הצהרת נגישות</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
