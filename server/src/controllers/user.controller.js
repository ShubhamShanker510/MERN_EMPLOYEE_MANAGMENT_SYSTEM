import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Getting tokens
const generateAccessTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();

        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerUser  = asyncHandler(async (req, res) => {
    // Getting user details
    const { userName, password, email, mobile, role } = req.body;

    // Not empty
    if ([userName, email, password, role].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Checking existing user
    const existingUser  = await User.findOne({ userName });

    if (existingUser ) {
        throw new ApiError(409, "User  already exists");
    }

    // Creating new user
    const newUser  = await User.create({
        userName,
        email,
        password,
        mobile,
        role,
    });

    const createdUser  = await User.findById(newUser ._id).select("-password");

    if (!createdUser ) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser , "User  registered successfully")
    );
});

const loginUser  = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    // Not empty
    if (!userName || !password) {
        throw new ApiError(400, "Username and Password are required");
    }

    // Finding user by username
    const user = await User.findOne({ userName });

    if (!user) {
        throw new ApiError(404, "User  does not exist");
    }

    // Password check
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User credentials");
    }

    // Access token
    const { accessToken } = await generateAccessTokens(user._id);

    // Retrieve the logged-in user without the password
    const loggedInUser  = await User.findById(user._id).select("-password");

    // Send cookies
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set secure flag based on environment
    };

    return res.status(200).cookie("accessToken", accessToken, options).json(
        new ApiResponse(
            200,
            {
                user: loggedInUser ,
                accessToken,
            },
            "User  logged in successfully"
        )
    );
});

const updateUser  = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    // Validate that at least one field is being updated
    if (Object.keys(updatedData).length === 0) {
        throw new ApiError(400, "No data provided for update");
    }

    // Find the user and update
    const updatedUser  = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUser ) {
        throw new ApiError(404, "User  not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUser , "User  details updated successfully")
    );
});

const deleteUser  = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedUser  = await User.findByIdAndDelete(id);
    if (!deletedUser ) {
        throw new ApiError(404, "User  not found");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedUser , "User  deleted successfully")
    );
});

export { registerUser , loginUser , updateUser , deleteUser  };