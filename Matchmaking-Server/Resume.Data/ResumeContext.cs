using Microsoft.EntityFrameworkCore;
using Resume.Core.Models;

namespace Resume.Data
{
    public class ResumeContext : DbContext
    {
        public ResumeContext(DbContextOptions<ResumeContext> options) : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<ResumeFile> ResumeFiles { get; set; }
        public virtual DbSet<Sharing> Sharings { get; set; }
        public virtual DbSet<Match> Matches { get; set; }
        public virtual DbSet<AIResponse> AIResponses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Match>()
                .HasKey(m => m.MatchID);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.Resumefile1)
                .WithMany()
                .HasForeignKey(m => m.ResumefileID1)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.Resumefile2)
                .WithMany()
                .HasForeignKey(m => m.ResumefileID2)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Files)
                .WithOne(f => f.User)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AIResponse>()
                .HasOne(a => a.User)
                .WithMany(u => u.Files)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
