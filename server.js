 


const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // For generating reference IDs

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const secret = 'mysecret';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userAuth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

// Complaint schema (Updated with more fields)
const complaintSchema = new mongoose.Schema({
  type: String,
  time: String,
  suspect: {
    name: String,
    description: String,
  },
  location: String,
  district: String,
  policeStation: String,
  referenceId: { type: String, unique: true },
  status: { type: String, default: 'Registered' }, // Default status is 'Registered'
  date: { type: Date, default: Date.now },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

// Predefined police officers list
const policeOfficers = [
  { name: 'Officer John Doe', rank: 'Inspector', station: 'Central Police Station', referenceId: 123},
  { name: 'Officer Jane Smith', rank: 'Constable', station: 'East District Police Station',referenceId: 13 },
  { name: 'Officer Robert Brown', rank: 'Sergeant', station: 'Westside Police Station',referenceId: 1234},
  { name: 'Officer Emily Johnson', rank: 'Lieutenant', station: 'South District Police Station',referenceId: 133},
];

// Signup route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: 'User signed up successfully' });
  } catch (err) {
    res.json({ success: false, message: 'Error during signup' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token (optional, for future use)
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });

    res.json({ success: true, message: 'Login successful', token });
  } catch (err) {
    res.json({ success: false, message: 'Error during login' });
  }
});

// Complaint registration route
app.post('/register-complaint', async (req, res) => {
  const { type, time, suspect, location, district, policeStation } = req.body;

  try {
    console.log('Complaint data received:', req.body); // Log received data

    // Generate a unique reference ID
    const  referenceId = uuidv4();

    console.log('Generated referenceId:', referenceId);

    const newComplaint = new Complaint({
      type,
      time,
      suspect,
      location,
      district,
      policeStation,
      referenceId:  referenceId,
    });

    console.log(newComplaint)


    await newComplaint.save();

    console.log('Complaint saved successfully:', newComplaint); // Log success
    res.json({ success: true, referenceId });
  } catch (err) {
    console.error('Error registering complaint:', err); // Log the error
    res.json({ success: false, message: 'Error registering complaint' });
  }
});

// Complaint tracking route
app.post('/track-complaint', async (req, res) => {
  const { referenceId } = req.body;

  try {
    const complaint = await Complaint.findOne({ referenceId });

    if (!complaint) {
      return res.json({ success: false, message: 'Complaint not found' });
    }

    // Randomly select a police officer from the list
    const randomOfficer = policeOfficers[Math.floor(Math.random() * policeOfficers.length)];

    // Return the complaint details along with random police officer details
    res.json({
      success: true,
      complaint,
      officer: randomOfficer,
    });
  } catch (err) {
    res.json({ success: false, message: 'Error tracking complaint' });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
