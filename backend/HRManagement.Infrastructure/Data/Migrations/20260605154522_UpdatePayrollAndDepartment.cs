using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HRManagement.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePayrollAndDepartment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Allowances",
                table: "Payrolls",
                newName: "UniformAllowance");

            migrationBuilder.AddColumn<decimal>(
                name: "HousingAllowance",
                table: "Payrolls",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MealAllowance",
                table: "Payrolls",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PhoneAllowance",
                table: "Payrolls",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ResponsibilityAllowance",
                table: "Payrolls",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TravelAllowance",
                table: "Payrolls",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "ParentDepartmentId",
                table: "Departments",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_ParentDepartmentId",
                table: "Departments",
                column: "ParentDepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Departments_ParentDepartmentId",
                table: "Departments",
                column: "ParentDepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Departments_ParentDepartmentId",
                table: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Departments_ParentDepartmentId",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "HousingAllowance",
                table: "Payrolls");

            migrationBuilder.DropColumn(
                name: "MealAllowance",
                table: "Payrolls");

            migrationBuilder.DropColumn(
                name: "PhoneAllowance",
                table: "Payrolls");

            migrationBuilder.DropColumn(
                name: "ResponsibilityAllowance",
                table: "Payrolls");

            migrationBuilder.DropColumn(
                name: "TravelAllowance",
                table: "Payrolls");

            migrationBuilder.DropColumn(
                name: "ParentDepartmentId",
                table: "Departments");

            migrationBuilder.RenameColumn(
                name: "UniformAllowance",
                table: "Payrolls",
                newName: "Allowances");
        }
    }
}
