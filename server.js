const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Kolam_site',
})
.then(() => console.log('MongoDB connected to Kolam_site'))
.catch(err => console.error('MongoDB connection error:', err));

// Import Threshold model
const Threshold = require('./models/Threshold');
const KolamNotebook = require('./models/KolamNotebook');

// Routes
app.get('/api/threshold', async (req, res) => {
  try {
    const thresholds = await Threshold.find();
    res.json(thresholds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/threshold', upload.single('project_image'), async (req, res) => {
  const threshold = new Threshold({
    title: req.body.title,
    desc: req.body.desc,
    content: req.body.content,
    date: req.body.date,
    project_image: req.file ? `/uploads/${req.file.filename}` : req.body.project_image,
    blocks: req.body.blocks ? JSON.parse(req.body.blocks) : [],
  });

  try {
    const newThreshold = await threshold.save();
    res.status(201).json(newThreshold);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/threshold/:id', upload.single('project_image'), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      desc: req.body.desc,
      content: req.body.content,
      date: req.body.date,
      blocks: req.body.blocks ? JSON.parse(req.body.blocks) : req.body.blocks,
    };

    if (req.file) {
      updateData.project_image = `/uploads/${req.file.filename}`;
    } else if (req.body.project_image) {
      updateData.project_image = req.body.project_image;
    }

    const updatedThreshold = await Threshold.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedThreshold) {
      return res.status(404).json({ message: 'Threshold not found' });
    }
    res.json(updatedThreshold);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/threshold/:id', async (req, res) => {
  try {
    const deletedThreshold = await Threshold.findByIdAndDelete(req.params.id);
    if (!deletedThreshold) {
      return res.status(404).json({ message: 'Threshold not found' });
    }
    res.json({ message: 'Threshold deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kolam Notebook Routes
app.get('/api/kolamnotebook', async (req, res) => {
  try {
    const notebooks = await KolamNotebook.find();
    res.json(notebooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/kolamnotebook', async (req, res) => {
  const notebook = new KolamNotebook({
    project_title: req.body.project_title,
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    project_image: req.body.project_image,
    date: req.body.date,
    blocks: req.body.blocks || [],
  });

  try {
    const newNotebook = await notebook.save();
    res.status(201).json(newNotebook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/kolamnotebook/:id', async (req, res) => {
  try {
    const updatedNotebook = await KolamNotebook.findByIdAndUpdate(
      req.params.id,
      {
        project_title: req.body.project_title,
        description: req.body.description,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        project_image: req.body.project_image,
        date: req.body.date,
        blocks: req.body.blocks,
      },
      { new: true }
    );
    if (!updatedNotebook) {
      return res.status(404).json({ message: 'Kolam Notebook not found' });
    }
    res.json(updatedNotebook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/kolamnotebook/:id', async (req, res) => {
  try {
    const deletedNotebook = await KolamNotebook.findByIdAndDelete(req.params.id);
    if (!deletedNotebook) {
      return res.status(404).json({ message: 'Kolam Notebook not found' });
    }
    res.json({ message: 'Kolam Notebook deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
