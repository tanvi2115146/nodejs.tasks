const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Specify the folder where files will be saved
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      // Rename the uploaded file 
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  });
  
  // Initialization of multer with storage configuration
  const upload = multer({ storage: storage });
  

  
  app.get('/', (req, res) => {
    res.send('Welcome to the file upload API!');
  });
  


  app.post('/upload', upload.single('image'), (req, res) => {
    // Access the uploaded file via `req.file`
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded!' });
    }
  
    // Respond with the file path
    res.status(200).json({
      message: 'File uploaded successfully!',
      filePath: `uploads/${req.file.filename}`
    });
  });



  

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  