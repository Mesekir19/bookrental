const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, sequelize } = require("../models");
const { Op } = require("sequelize");
const {
  registerUserSchema,
  loginUserSchema,
  approveUserSchema,
} = require("../utils/validationSchemas");

const registerUser = async (req, res) => {
  try {
    console.log("registered ", req.body);

    registerUserSchema.parse(req.body);

    const { name, username, password, role, phoneNumber, location } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: username,
      password: hashedPassword,
      phone: phoneNumber,
      location,
      role,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const approveUser = async (req, res) => {
  try {
    approveUserSchema.parse(req.params);
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({ message: "User approved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    loginUserSchema.parse(req.body);

    const { username, password } = req.body;
    const user = await User.findOne({ where: { email: username } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "phone",
        "location",
        "isApproved",
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Books" WHERE "Books"."ownerId" = "User"."id")`
          ),
          "bookCount",
        ],
        [sequelize.literal("true"), "status"], // Add a 'status' field with a value of 'true'
      ],
      where: {
        role: {
          [Op.ne]: "admin", // Exclude users with role 'admin'
        },
      },
      logging: console.log, // Log SQL query to see what Sequelize is generating
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  approveUser,
  loginUser,
  getAllUsers,
  deleteUser,
};
