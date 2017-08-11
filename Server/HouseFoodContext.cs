﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;
using HouseMoneyAPI.Model;

namespace HouseMoneyAPI
{
    public partial class HouseFoodContext : DbContext
    {
        public virtual DbSet<Days> Days { get; set; }
        public virtual DbSet<Groupingredients> Groupingredients { get; set; }
        public virtual DbSet<Groups> Groups { get; set; }
        public virtual DbSet<Ingredients> Ingredients { get; set; }
        public virtual DbSet<Listitems> Listitems { get; set; }
        public virtual DbSet<Lists> Lists { get; set; }
        public virtual DbSet<Mealingredients> Mealingredients { get; set; }
        public virtual DbSet<Meals> Meals { get; set; }
        public virtual DbSet<People> People { get; set; }

        public IConfigurationRoot Configuration { get; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"server=EDLAPTOP\EDLAPTOPSQL; Database=HouseFood_Dev; User Id=chris; Password=Kilburn1; timeout=30");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Days>(entity =>
            {
                entity.HasKey(e => e.Date)
                    .HasName("PK__DAYS__1F7C70C4DF52F3E2");

                entity.ToTable("DAYS");

                entity.Property(e => e.Date)
                    .HasColumnName("DATE")
                    .HasColumnType("date");

                entity.Property(e => e.Mealid).HasColumnName("MEALID");

                entity.Property(e => e.Numberofpeople).HasColumnName("NUMBEROFPEOPLE");

                entity.HasOne(d => d.Meal)
                    .WithMany(p => p.Days)
                    .HasForeignKey(d => d.Mealid)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_DAYS_MEALID");
            });

            modelBuilder.Entity<Groupingredients>(entity =>
            {
                entity.HasKey(e => new { e.Groupid, e.Ingredientid })
                    .HasName("PK__GROUPING__02DFB36B3E4188C1");

                entity.ToTable("GROUPINGREDIENTS");

                entity.Property(e => e.Groupid).HasColumnName("GROUPID");

                entity.Property(e => e.Ingredientid).HasColumnName("INGREDIENTID");

                entity.Property(e => e.Amount).HasColumnName("AMOUNT");

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.Groupingredients)
                    .HasForeignKey(d => d.Groupid)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_GROUPINGREDIENTS_GROUPID");

                entity.HasOne(d => d.Ingredient)
                    .WithMany(p => p.Groupingredients)
                    .HasForeignKey(d => d.Ingredientid)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_GROUPINGREDIENTS_INGREDIENTID");
            });

            modelBuilder.Entity<Groups>(entity =>
            {
                entity.HasKey(e => e.Groupid)
                    .HasName("PK__GROUPS__2F41C6299375DCA9");

                entity.ToTable("GROUPS");

                entity.Property(e => e.Groupid).HasColumnName("GROUPID");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("NAME")
                    .HasMaxLength(200);
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
                    .HasMaxLength(10);
            });

            modelBuilder.Entity<Listitems>(entity =>
            {
                entity.HasKey(e => new { e.Listid, e.Ingredientid })
                    .HasName("PK__LISTITEM__98DBF5A6F018DF0A");

                entity.ToTable("LISTITEMS");

                entity.Property(e => e.Listid).HasColumnName("LISTID");

                entity.Property(e => e.Ingredientid).HasColumnName("INGREDIENTID");

                entity.Property(e => e.Amount).HasColumnName("AMOUNT");

                entity.Property(e => e.Complete)
                    .HasColumnName("COMPLETE")
                    .HasDefaultValueSql("0");

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
                entity.HasKey(e => new { e.Mealid, e.Ingredientid })
                    .HasName("PK__MEALINGR__69CF20A984636528");

                entity.ToTable("MEALINGREDIENTS");

                entity.Property(e => e.Mealid).HasColumnName("MEALID");

                entity.Property(e => e.Ingredientid).HasColumnName("INGREDIENTID");

                entity.Property(e => e.Amount).HasColumnName("AMOUNT");

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
                entity.HasKey(e => new { e.Date, e.Person })
                    .HasName("PK__PEOPLE__F795C913B4A8DBA3");

                entity.ToTable("PEOPLE");

                entity.Property(e => e.Date)
                    .HasColumnName("DATE")
                    .HasColumnType("date");

                entity.Property(e => e.Person)
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