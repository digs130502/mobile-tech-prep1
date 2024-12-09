import * as dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env file

export default {
  apiBaseUrl: process.env.API_BASE_URL,  // Access the environment variable
};