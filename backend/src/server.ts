import mongoose from 'mongoose';
import app from './app';
import { config } from './config';

// ─── MongoDB Connection ─────────────────────────────────────────────
async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(config.mongodbUri);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// ─── Mongoose Connection Events ─────────────────────────────────────
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});

// ─── Start Server ───────────────────────────────────────────────────
async function startServer(): Promise<void> {
    await connectDB();

    app.listen(config.port, () => {
        console.log(`🚀 SarvaHub API server running on port ${config.port}`);
        console.log(`📦 Environment: ${config.nodeEnv}`);
        console.log(`🔗 Health check: http://localhost:${config.port}/health`);
    });
}

// ─── Graceful Shutdown ──────────────────────────────────────────────
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

// ─── Unhandled Rejection / Exception Handlers ───────────────────────
process.on('unhandledRejection', (reason: any) => {
    console.error('🚨 Unhandled Promise Rejection:', reason);
    // In production, crash to let the process manager (PM2/Docker) restart
    process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
    console.error('🚨 Uncaught Exception:', err);
    process.exit(1);
});

startServer();
