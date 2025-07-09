const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 1. Load the controller factory
const uploadControllerFactory = require('./controllers/uploadController');
// 2. Create the controller instance, passing the 'upload' middleware
const uploadController = uploadControllerFactory(upload);

// 3. Load the routes factory and pass the created controller to it
const userRoutes = require('./router/user.routes');
const uploadRoutes = require('./router/upload.routes')(uploadController);

app.use('/api/user', userRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send("TRAE AI Backend API");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
