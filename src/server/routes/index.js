// // server/routes/index.js
// const express = require('express');
// const authRoutes = require('./auth.routes');
// const userRoutes = require('./user.routes');
// const formRoutes = require('./form.routes');

// const router = express.Router();

// // Documentation route
// router.get('/', (req, res) => {
//   res.json({
//     message: 'API Documentation',
//     version: '1.0.0',
//     endpoints: {
//       auth: '/api/auth',
//       users: '/api/users',
//       forms: '/api/forms',
//     }
//   });
// });

// // Register all route modules
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/forms', formRoutes);

// module.exports = router;