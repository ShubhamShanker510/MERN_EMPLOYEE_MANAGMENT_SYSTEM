import express from 'express';
import { 
    createEmployee, 
    deleteEmployee, 
    getAllEmployees, 
    getEmployeeById, 
    toggleEmployeeStatus, 
    updateEmployee 
} from '../controllers/employee.controller.js';
// import { validateEmployee } from '../middlewares/validation.middleware.js'; // Import validation middleware

const router = express.Router();

// Middleware to authenticate user for all employee routes

// Route to create a new employee
router.route('/employees')
    .post(createEmployee) // Validate data before creating
    .get(getAllEmployees); // Get all employees

// Route to get a single employee by ID
router.route('/employees/:id')
    .get(getEmployeeById) // Get employee by ID
    .put(updateEmployee) // Validate data before updating
    .delete(deleteEmployee); // Delete employee by ID

// Route to activate/deactivate an employee by ID
router.route('/employees/:id/status')
    .patch(toggleEmployeeStatus); // Toggle employee status



export default router;