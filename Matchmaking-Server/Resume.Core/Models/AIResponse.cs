using Resume.Core.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class AIResponse
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }

    public string FileName { get; set; }
    public string FirstName { get; set; }
    public string FatherName { get; set; }
    public string MotherName { get; set; }
    public string LastName { get; set; }
    //public string FatherField { get; set; }
    //public string MotherField { get; set; }
    //public int NumberOfChildren { get; set; }

    // תחום אמא ואבא
    //מס ילדים
    //מכרים מחותנים שכנים ומורות -אח''כ
    //עדכון גיל לפי הזמן יצירה+גיל קיים
    public string Address { get; set; }
    public string PlaceOfStudy { get; set; }
    public string Occupation { get; set; }
    public string Height { get; set; }
    public string Age { get; set; }
    public DateTime? CreatedAt { get; set; }
}
