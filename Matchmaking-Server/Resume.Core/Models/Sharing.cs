using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Resume.Core.Models
{
    public class Sharing
    {
        [Key]
        public int ShareID { get; set; } // מזהה השיתוף

        public int ResumefileID { get; set; } // מזהה הרזומה

        public int SharedWithUserID { get; set; } // עם מי שיתף

        public DateTime SharedAt { get; set; } = DateTime.UtcNow; // תאריך השיתוף עם ערך ברירת מחדל

        public ResumeFile Resumefile { get; set; } // קשר ל-ResumeFile

        public List<User> SharedWithUser { get; set; } = new List<User>(); // רשימה של משתמשים
    }
}
