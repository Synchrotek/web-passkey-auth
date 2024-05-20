import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
config();

const app = express();

app.use(cors({
    // eslint-disable-next-line no-undef
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200, // For legacy browser support
}));
app.use(express.json());

// routes ====================================================
import authRouter from './routes.js';
app.use('/', authRouter);

// server listen ===============================================
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
    console.log(`server running on PORT: ${PORT}`);
});
