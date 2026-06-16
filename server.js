const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const aboutRoutes = require('./routes/about');
const contactRoutes = require('./routes/contact');
const educationRoutes = require('./routes/education');
const experienceRoutes = require('./routes/experience');
const projectRoutes = require('./routes/project');
const serviceRoutes = require('./routes/service');
const pdfTemplateRoutes = require('./routes/pdfTemplate');
const contactFormRoutes = require('./routes/contactForm');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/pdf-template', pdfTemplateRoutes);
app.use('/api/contact-form', contactFormRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
};

start();
