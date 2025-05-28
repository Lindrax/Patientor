'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };

Object.defineProperty(exports, '__esModule', { value: true });
const path = require('path');
const express_1 = __importDefault(require('express'));
const cors_1 = __importDefault(require('cors'));

const diagnoseRouter_1 = __importDefault(require('./routes/diagnoseRouter'));
const patientRouter_1 = __importDefault(require('./routes/patientRouter'));

const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 3001; // Azure App Service sets process.env.PORT
// API routes

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});
app.use('/api/diagnoses', diagnoseRouter_1.default);
app.use('/api/patients', patientRouter_1.default);

// Serve static files
const frontendPath = path.join(__dirname, '..', 'dist');
app.use(express_1.default.static(frontendPath));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        console.error(`Error serving index.html for ${req.path}:`, err);
        res
          .status(500)
          .send('An error occurred while serving the application.');
      }
    });
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
