    import express from 'express';
    import cors from 'cors';
    import connectDB from './src/config/db.js';
    import userRoutes from "./src/features/user/user.routes.js"
    import appraisalRoutes from "./src/features/appraisal/appraisal.routes.js"
    import { protect } from './src/middlewares/authMiddlewares.js';
    import employeesRoutes from "./src/features/Employees/employees.routes.js"

    const app = express();
    const PORT = process.env.PORT || 5000;

    // Connect to MongoDB
    connectDB();

    // Middleware
    app.use(cors({
        origin: 'http://localhost:3000', // Replace with your frontend's URL
        methods: ['GET', 'POST'], // Allowed methods
        allowedHeaders: ['Authorization', 'Content-Type'], // Allowed headers
    }));
    app.use(express.json());

    // Routes
    app.use('/api/users', userRoutes);
    app.use('/api/appraisals', protect, appraisalRoutes);
    app.use('/api/employees', protect, employeesRoutes)
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
