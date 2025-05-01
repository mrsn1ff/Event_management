const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// ✅ Login API with detailed logs
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('--- Login Attempt ---');
    console.log('Username:', username);
    console.log('Password (raw):', password);

    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.log('No user found with username:', username);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found. Hashed password from DB:', admin.password);

    const isMatch = await admin.comparePassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!admin.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval.' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token will expire after 1 hour
    );

    console.log('JWT token generated successfully');

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Register API
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('--- Register Attempt ---');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password (raw):', password);

    const newAdmin = new Admin({
      username,
      email,
      password,
    });

    await newAdmin.save();
    console.log('New admin saved successfully');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/pending-admins', async (req, res) => {
  try {
    const pendingAdmins = await Admin.find({ isApproved: false });
    res.json(pendingAdmins);
  } catch (error) {
    console.error('Error fetching pending admins:', error);
    res.status(500).json({ message: 'Error fetching pending admins' });
  }
});


router.patch('/approve-admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.isApproved = true;
    admin.role = 'admin';
    await admin.save();

    res.json({ message: 'Admin approved successfully' });
  } catch (error) {
    console.error('Error approving admin:', error);
    res.status(500).json({ message: 'Error approving admin' });
  }
});


// ✅ Get all admins (for testing/debugging)
router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
});

module.exports = router;