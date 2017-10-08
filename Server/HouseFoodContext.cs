using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;
using HouseFoodAPI.Model;

namespace HouseFoodAPI
{
    public partial class HouseFoodContext : DbContext
    {
        public HouseFoodContext(DbContextOptions<HouseFoodContext> options) : base(options)
        {
        }
        public virtual DbSet<Days> Days { get; set; }
        public virtual DbSet<Ingredients> Ingredients { get; set; }
        public virtual DbSet<Listitems> Listitems { get; set; }
        public virtual DbSet<Lists> Lists { get; set; }
        public virtual DbSet<Mealingredients> Mealingredients { get; set; }
        public virtual DbSet<Meals> Meals { get; set; }
        public virtual DbSet<People> People { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Days>(entity =>
            {
                entity.HasKey(e => e.Date)
                    .HasName("PK__DAYS__1F7C70C4EFB621FC");

                entity.ToTable("DAYS");

                entity.Property(e => e.Date)
                    .HasColumnName("DATE")
                    .HasColumnType("date");

                entity.Property(e => e.Mealid).HasColumnName("MEALID");

                entity.Property(e => e.Numberofpeople)
                    .HasColumnName("NUMBEROFPEOPLE")
                    .HasComputedColumnSql("[dbo].[DAYS_GetNumberOfPeople]([DATE])")
                    .ValueGeneratedOnAddOrUpdate();

                entity.HasOne(d => d.Meal)
                    .WithMany(p => p.Days)
                    .HasForeignKey(d => d.Mealid)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_DAYS_MEALID");
            });

            modelBuilder.Entity<Ingredients>(entity =>
            {
                entity.HasKey(e => e.Ingredientid)
                    .HasName("PK__INGREDIE__D9E7542310A6E793");

                entity.ToTable("INGREDIENTS");

                entity.Property(e => e.Ingredientid).HasColumnName("INGREDIENTID");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasMaxLength(200);

                entity.Property(e => e.Units)
                    .IsRequired()
                    .HasColumnName("UNITS")
                    .HasMaxLength(20);
            });

            modelBuilder.Entity<Listitems>(entity =>
            {
                entity.HasKey(e => e.Listitemid)
                    .HasName("PK__LISTITEM__66B6E84C0ADA3594");

                entity.ToTable("LISTITEMS");

                entity.Property(e => e.Listitemid).HasColumnName("LISTITEMID");

                entity.Property(e => e.Amount)
                    .HasColumnName("AMOUNT")
                    .HasColumnType("decimal");

                entity.Property(e => e.Complete)
                    .HasColumnName("COMPLETE")
                    .HasDefaultValueSql("0");

                entity.Property(e => e.Ingredientid).HasColumnName("INGREDIENTID");

                entity.Property(e => e.Listid).HasColumnName("LISTID");

                entity.HasOne(d => d.Ingredient)
                    .WithMany(p => p.Listitems)
                    .HasForeignKey(d => d.Ingredientid)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_LISTITEMS_INGREDIENTID");

                entity.HasOne(d => d.List)
                    .WithMany(p => p.Listitems)
                    .HasForeignKey(d => d.Listid)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_LISTITEMS_LISTID");
            });

            modelBuilder.Entity<Lists>(entity =>
            {
                entity.HasKey(e => e.Listid)
                    .HasName("PK__LISTS__B54580E4CF0C06ED");

                entity.ToTable("LISTS");

                entity.Property(e => e.Listid).HasColumnName("LISTID");

                entity.Property(e => e.Complete)
                    .HasColumnName("COMPLETE")
                    .HasDefaultValueSql("0");

                entity.Property(e => e.Datecompleted)
                    .HasColumnName("DATECOMPLETED")
                    .HasColumnType("datetime");

                entity.Property(e => e.Datecreated)
                    .HasColumnName("DATECREATED")
                    .HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasMaxLength(200);
            });

            modelBuilder.Entity<Mealingredients>(entity =>
            {
                entity.HasKey(e => e.Mealingredientid)
                    .HasName("PK__MEALINGR__D74DD616EE96AE4F");

                entity.ToTable("MEALINGREDIENTS");

                entity.Property(e => e.Mealingredientid).HasColumnName("MEALINGREDIENTID");

                entity.Property(e => e.Amount)
                    .HasColumnName("AMOUNT")
                    .HasColumnType("decimal");

                entity.Property(e => e.Ingredientid).HasColumnName("INGREDIENTID");

                entity.Property(e => e.Mealid).HasColumnName("MEALID");

                entity.HasOne(d => d.Ingredient)
                    .WithMany(p => p.Mealingredients)
                    .HasForeignKey(d => d.Ingredientid)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_MEALINGREDIENTS_INGREDIENTID");

                entity.HasOne(d => d.Meal)
                    .WithMany(p => p.Mealingredients)
                    .HasForeignKey(d => d.Mealid)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_MEALINGREDIENTS_MEALID");
            });

            modelBuilder.Entity<Meals>(entity =>
            {
                entity.HasKey(e => e.Mealid)
                    .HasName("PK__MEALS__445155EBFA780D20");

                entity.ToTable("MEALS");

                entity.Property(e => e.Mealid).HasColumnName("MEALID");

                entity.Property(e => e.Category)
                    .IsRequired()
                    .HasColumnName("CATEGORY")
                    .HasMaxLength(20);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasMaxLength(200);
            });

            modelBuilder.Entity<People>(entity =>
            {
                entity.HasKey(e => e.Personid)
                    .HasName("PK__PEOPLE__0986239E70561B1A");

                entity.ToTable("PEOPLE");

                entity.Property(e => e.Personid).HasColumnName("PERSONID");

                entity.Property(e => e.Date)
                    .HasColumnName("DATE")
                    .HasColumnType("date");

                entity.Property(e => e.Person)
                    .IsRequired()
                    .HasColumnName("PERSON")
                    .HasMaxLength(100);

                entity.HasOne(d => d.DateNavigation)
                    .WithMany(p => p.People)
                    .HasForeignKey(d => d.Date)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_PEOPLE_DATE");
            });
        }
    }
}