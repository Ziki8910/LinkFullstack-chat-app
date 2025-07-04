import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

// import mongoose from "mongoose";
// import dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

// // Connection configuration - removed deprecated options
// const connectionOptions = {
//   serverSelectionTimeoutMS: 5000,    // 5s timeout for server selection
//   socketTimeoutMS: 45000,           // Close sockets after 45s inactivity 
//   maxPoolSize: 10,                  // Connection pool size
//   retryWrites: true,
//   w: "majority",
//   retryReads: true                  // Added for read operations
// };

// // Connection state tracker
// const connectionState = {
//   isConnected: false,
//   retryCount: 0,
//   MAX_RETRIES: 5,
//   RETRY_DELAY: 2000,                // 2 seconds between retries
//   isConnecting: false
// };

// const connectDB = async () => {
//   // Return existing connection if healthy
//   if (connectionState.isConnected && mongoose.connection.readyState === 1) {
//     console.log('Using existing database connection');
//     return;
//   }

//   // Prevent multiple concurrent connection attempts
//   if (connectionState.isConnecting) {
//     console.log('Connection attempt already in progress');
//     return;
//   }

//   // Check max retries
//   if (connectionState.retryCount >= connectionState.MAX_RETRIES) {
//     console.error(`Maximum connection retries (${connectionState.MAX_RETRIES}) reached`);
//     throw new Error('Database connection failed');
//   }

//   try {
//     connectionState.isConnecting = true;
//     connectionState.retryCount++;
    
//     console.log(`Attempting MongoDB connection (Attempt ${connectionState.retryCount}/${connectionState.MAX_RETRIES})...`);
    
//     const conn = await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    
//     connectionState.isConnected = true;
//     connectionState.isConnecting = false;
//     connectionState.retryCount = 0; // Reset on success
    
//     console.log(`✅ MongoDB connected to ${conn.connection.host}/${conn.connection.name}`);
//     return conn;
    
//   } catch (error) {
//     connectionState.isConnected = false;
//     connectionState.isConnecting = false;
    
//     console.error(`❌ Connection attempt failed: ${error.message}`);
    
//     if (connectionState.retryCount < connectionState.MAX_RETRIES) {
//       console.log(`Retrying in ${connectionState.RETRY_DELAY/1000} seconds...`);
//       await new Promise(resolve => setTimeout(resolve, connectionState.RETRY_DELAY));
//       return connectDB();
//     }
    
//     throw error; // Re-throw after max retries
//   }
// };

// // Enhanced event handlers
// mongoose.connection.on('connected', () => {
//   connectionState.isConnected = true;
//   console.log('📊 Mongoose connection established');
// });

// mongoose.connection.on('error', (err) => {
//   connectionState.isConnected = false;
//   console.error(`⚠️ Mongoose connection error: ${err.message}`);
// });

// mongoose.connection.on('disconnected', () => {
//   connectionState.isConnected = false;
//   console.log('🔌 Mongoose connection lost');
  
//   // Auto-reconnect only if this wasn't a deliberate closure
//   if (!connectionState.isShuttingDown) {
//     console.log('Attempting to reconnect...');
//     connectDB().catch(err => console.error('Reconnect failed:', err));
//   }
// });

// // Graceful shutdown handler
// let isShuttingDown = false;
// const gracefulShutdown = async () => {
//   if (isShuttingDown) return;
//   isShuttingDown = true;
  
//   try {
//     console.log('Closing MongoDB connection...');
//     await mongoose.connection.close();
//     console.log('MongoDB connection closed gracefully');
//     process.exit(0);
//   } catch (err) {
//     console.error('Failed to close MongoDB connection:', err);
//     process.exit(1);
//   }
// };

// process.on('SIGINT', gracefulShutdown);
// process.on('SIGTERM', gracefulShutdown);

// // Health check utility
// export const checkDBHealth = () => ({
//   isConnected: mongoose.connection.readyState === 1,
//   readyState: mongoose.connection.readyState,
//   host: mongoose.connection?.host,
//   dbName: mongoose.connection?.name
// });

// export { connectDB };