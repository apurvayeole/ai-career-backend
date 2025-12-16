// import dotenv from 'dotenv';
// import express from 'express';
// import cors from 'cors';

// // Load environment variables from .env file
// dotenv.config({ path: '../.env' });

// const PORT = 5000;

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.set('view engine', 'ejs');
// app.set('views', './views');

// import authRoutes from './routes/auth.routes.js';
// app.use('/user', authRoutes);

// app.get("/api/test", (req, res) =>{
//     res.json({ message: "Test endpoint working!" });
// });

// app.listen(PORT, () => {
//   console.log(`Backend running on http://localhost:${PORT}`);
// });

// export default app;