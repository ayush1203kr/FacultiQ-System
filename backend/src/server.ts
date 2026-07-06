import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middleware/error';
import { swaggerSpec } from './lib/swagger';

import authRoutes from './routes/auth';
import facultyRoutes from './routes/faculty';
import departmentRoutes from './routes/departments';
import analyticsRoutes from './routes/analytics';
import activityRoutes from './routes/activity';

const app = express();

const PORT = Number(process.env.PORT || 8001);

// Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(cors());

app.use(express.json({ limit: '1mb' }));

app.use(morgan('dev'));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'facultiq-backend',
    time: new Date().toISOString(),
  });
});

// Swagger
app.get('/api/docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'FacultiQ API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/faculty', facultyRoutes);

app.use('/api/departments', departmentRoutes);

app.use('/api/analytics', analyticsRoutes);

app.use('/api/activity-logs', activityRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({
    message: 'Not Found',
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `🚀 FacultiQ Backend running on http://localhost:${PORT}`
  );
});