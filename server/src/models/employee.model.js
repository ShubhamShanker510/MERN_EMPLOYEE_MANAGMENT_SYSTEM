import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    f_Id: {
        type: String,
        required: true,
        unique: true,
    },
    f_Image: {
        type: String, // URL or path to the image
        validate: {
            validator: function(v) {
                return /^(http|https):\/\/[^ "]+$/.test(v); // Simple URL validation
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    f_Name: {
        type: String,
        required: [true, "Name is required"],
    },
    f_Email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    f_Mobile: {
        type: String,
        required: [true, "Mobile number is required"],
        unique: true,
    },
    f_Designation: {
        type: String,
        required: [true, "Designation is required"],
    },
    f_Gender: {
        type: String,
        enum: ['M', 'F'],
        required: [true, "Gender is required"],
    },
    f_Course: {
        type: String,
        enum: ['MCA', 'BCA', 'BSC'],
        required: [true, "Course is required"],
    },
    isActive: { type: Boolean, default: true },
    f_Createdate: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

export const Employee = mongoose.model("Employee", employeeSchema);