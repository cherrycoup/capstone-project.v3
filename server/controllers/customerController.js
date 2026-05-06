import Customer from "../models/Customer.js";
import User from "../models/User.js";
import {
    cleanString,
    cleanProfileImage,
    isValidObjectId,
    normalizeEmail,
} from "../utils/validation.js";

const mapCustomerInput = (body) => {
    const contactInfo = body.contactInfo || {};

    return {
        name: cleanString(body.name, 120),
        contactInfo: {
            email: normalizeEmail(contactInfo.email),
            phone: cleanString(contactInfo.phone, 30),
            address: cleanString(contactInfo.address, 500),
        },
        role: ["Guest", "Member"].includes(body.role) ? body.role : "Member",
        profileImageUrl: cleanProfileImage(body.profileImageUrl),
    };
};

/**
 * Get all customers (Staff/Admin only)
 */
export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: customers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * Get authenticated customer profile
 */
export const getCurrentCustomer = async (req, res) => {
    try {
        if (req.user?.type !== "customer") {
            return res.status(403).json({
                success: false,
                message: "Customer account required",
            });
        }

        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        const customer = user.customerId
            ? await Customer.findById(user.customerId)
            : await Customer.findOne({ "contactInfo.email": user.email });

        res.status(200).json({
            success: true,
            data: {
                user,
                customer,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * Update authenticated customer profile
 */
export const updateCurrentCustomer = async (req, res) => {
    try {
        if (req.user?.type !== "customer") {
            return res.status(403).json({
                success: false,
                message: "Customer account required",
            });
        }

        const name = cleanString(req.body.name, 120);
        const phone = cleanString(req.body.phone, 30);
        const address = cleanString(req.body.address, 500);
        const profileImageUrl = cleanProfileImage(req.body.profileImageUrl);

        if (!name || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: "Name, phone, and address are required",
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        user.name = name;
        user.phone = phone;
        user.address = address;
        user.profileImageUrl = profileImageUrl;

        let customer = user.customerId
            ? await Customer.findById(user.customerId)
            : await Customer.findOne({ "contactInfo.email": user.email });

        if (!customer) {
            customer = await Customer.create({
                name,
                contactInfo: {
                    email: user.email,
                    phone,
                    address,
                },
                profileImageUrl,
                role: "Member",
            });
            user.customerId = customer._id;
        } else {
            customer.name = name;
            customer.contactInfo.phone = phone;
            customer.contactInfo.address = address;
            customer.profileImageUrl = profileImageUrl;
            customer.role = "Member";
            customer.updatedAt = new Date();
            await customer.save();
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                id: user._id,
                customerId: customer._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                profileImageUrl: user.profileImageUrl || "",
                role: user.role,
                memberRole: customer.role,
                type: "customer",
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * Get customer by ID
 */
export const getCustomerById = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }

        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * Get customer by email
 */
export const getCustomerByEmail = async (req, res) => {
    try {
        const email = normalizeEmail(req.params.email);
        const customer = await Customer.findOne({ "contactInfo.email": email });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * Create new customer
 */
export const createCustomer = async (req, res) => {
    try {
        const payload = mapCustomerInput(req.body);

        if (!payload.name || !payload.contactInfo.email || !payload.contactInfo.phone) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and phone are required",
            });
        }

        const existingCustomer = await Customer.findOne({
            "contactInfo.email": payload.contactInfo.email,
        });

        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        const newCustomer = await Customer.create(payload);
        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: newCustomer,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * Update customer
 */
export const updateCustomer = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }

        const payload = mapCustomerInput(req.body);

        if (!payload.name || !payload.contactInfo.email || !payload.contactInfo.phone) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and phone are required",
            });
        }

        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                ...payload,
                updatedAt: new Date(),
            },
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: customer,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * Delete customer
 */
export const deleteCustomer = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }

        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * Get customer count (Dashboard stats)
 */
export const getCustomerStats = async (req, res) => {
    try {
        const [totalCustomers, members, guests] = await Promise.all([
            Customer.countDocuments(),
            Customer.countDocuments({ role: "Member" }),
            Customer.countDocuments({ role: "Guest" }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalCustomers,
                members,
                guests,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
