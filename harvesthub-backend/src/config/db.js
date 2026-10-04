import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  mongoose.set('strictQuery', true);

  const connection = await mongoose.connect(process.env.MONGO_URI);

  console.log(
    `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
  );
};

export default connectDB;