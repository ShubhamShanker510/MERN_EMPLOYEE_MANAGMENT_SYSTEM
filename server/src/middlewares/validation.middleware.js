import { body, validationResult } from 'express-validator';

export const validateEmployee = [
    body('f_Name').notEmpty().withMessage('Name is required'),
    body('f_Email').isEmail().withMessage('Valid email is required'),
    body('f_Mobile').isNumeric().withMessage('Mobile number must be numeric'),
    body('f_Designation').notEmpty().withMessage('Designation is required'),
    body('f_gender').isIn(['M', 'F']).withMessage('Gender must be M or F'),
    body('f_Course').isIn(['MCA', 'BCA', 'BSC']).withMessage('Course must be one of MCA, BCA, BSC'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
