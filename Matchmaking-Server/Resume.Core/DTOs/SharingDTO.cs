using System;

namespace Resume.Core.DTOs
{
    public class SharingDTO
    {
        public int UserId { get; set; } // SharedByUserID
        public int ResumeFileId { get; set; }
        public int? SharedWithUserId { get; set; } // אופציונלי, null אם shareAll
        public bool ShareAll { get; set; }
    }
}
