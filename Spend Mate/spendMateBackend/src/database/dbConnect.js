import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

const connection = {};

const dbConnect = async () => {
  if (connection.isConnected) {
    console.log("Database Already Connected !");
    return;
  }

  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = connect.connections[0].readyState;

    console.log("Database Connected Successfully !");
  } catch (error) {
    console.log("Database Failed to Connect !");
    process.exit(1);
  }
};

export default dbConnect;
