using System;

namespace Resume.Core.DTOs
{
    public class SharingDTO
    {
        public int ShareID { get; set; } // מזהה השיתוף
        public int ResumefileID { get; set; } // מזהה הרזומה
        public int SharedByUserID { get; set; } // הוספת שדה זה
        public int SharedWithUserID { get; set; } // עם מי שיתף
        public DateTime SharedAt { get; set; } // תאריך השיתוף
    }
}
