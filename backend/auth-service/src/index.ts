import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

import app from './app';


const PORT  = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
})