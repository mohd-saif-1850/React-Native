import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import dbConnect from './database/dbConnect.js'
import app from './app.js';

dbConnect().then( () => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch(err => console.log(err));