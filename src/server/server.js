require('dotenv').config();
const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});