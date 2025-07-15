namespace Resume.API.PostModels
{
    public class SharingPostModel
    {
        public int ResumefileID { get; set; }
        public int SharedWithUserID { get; set; }
        public int SharedByUserID { get; set; }
    }
}
