import { Employee } from "../models/employee.model.js"; // Import the Employee model
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new employee
const createEmployee = asyncHandler(async (req, res) => {
    const { f_Id, f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course } = req.body;

    // Validate that req.body is defined and required fields are present
    if (!req.body || [f_Id, f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course].some((field) => field === undefined || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check for existing employee by email
    const existingEmployee = await Employee.findOne({ f_Email });
    if (existingEmployee) {
        throw new ApiError(409, "Employee with this email already exists");
    }

    // Create new employee
    const newEmployee = await Employee.create({
        f_Id,
        f_Name,
        f_Email,
        f_Mobile,
        f_Designation,
        f_Gender,
        f_Course,
    });

    return res.status(201).json(
        new ApiResponse(200, newEmployee, "Employee created successfully")
    );
});

// Get all employees with search, filter, pagination, and sorting
const getAllEmployees = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 10, sortBy = 'f_Name', order = 'asc' } = req.query;

    const query = {};
    if (search) {
        query.$or = [
            { f_Name: { $regex: search, $options: 'i' } },
            { f_Email: { $regex: search, $options: 'i' } },
            { f_Id: { $regex: search, $options: 'i' } }
        ];
    }

    const totalEmployees = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
        .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    return res.status(200).json(
        new ApiResponse(200, {
            total: totalEmployees,
            page: Number(page),
            limit: Number(limit),
            employees,
        }, "Employees retrieved successfully")
    );
});

// Get a single employee by ID
const getEmployeeById = asyncHandler(async (req, res) => {
    const { id } = req.params; // This is f_Id, not _id
    const employee = await Employee.findOne({ f_Id: id }); // Use f_Id for lookup

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    return res.status(200).json(
        new ApiResponse(200, employee, "Employee retrieved successfully")
    );
});

// Update an employee
const updateEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params; // This is f_Id, not _id
    const updatedData = req.body;

    // Validate that at least one field is being updated
    if (Object.keys(updatedData).length === 0) {
        throw new ApiError(400, "No data provided for update");
    }

    // Find the employee and update using f_Id
    const updatedEmployee = await Employee.findOneAndUpdate({ f_Id: id }, updatedData, { new: true });

    if (!updatedEmployee) {
        throw new ApiError(404, "Employee not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedEmployee, "Employee details updated successfully")
    );
});

// Delete an employee
const deleteEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params; // This is f_Id, not _id

    const deletedEmployee = await Employee.findOneAndDelete({ f_Id: id }); // Use f_Id for deletion
    if (!deletedEmployee) {
        throw new ApiError(404, "Employee not found");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedEmployee, "Employee deleted successfully")
    );
});

// Activate/Deactivate an employee
const toggleEmployeeStatus = asyncHandler(async (req, res) => {
    const { id } = req.params; // This is f_Id, not _id
    const { isActive } = req.body; // Expecting a boolean value

    // Validate that isActive is a boolean
    if (typeof isActive !== 'boolean') {
        throw new ApiError(400, "isActive must be a boolean value");
    }

    // Find the employee and update their active status using f_Id
    const updatedEmployee = await Employee.findOneAndUpdate({ f_Id: id }, { isActive }, { new: true });

    if (!updatedEmployee) {
        throw new ApiError(404, "Employee not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedEmployee, `Employee status updated to ${isActive ? 'active' : 'inactive'} successfully`)
    );
});

export { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, toggleEmployeeStatus };