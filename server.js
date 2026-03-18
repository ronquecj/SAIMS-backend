const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const treasurerRoutes = require('./routes/treasurerRoutes');
const minuteRoutes = require('./routes/minuteRoutes');
const timekeeperRoutes = require('./routes/timekeeperRoutes');
const presidentRoutes = require('./routes/presidentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [process.env.CLIENT_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

// app.use(cors(corsOptions));
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('SAIMS API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/treasurer', treasurerRoutes);
app.use('/api/minutes', minuteRoutes);
app.use('/api/timekeeper', timekeeperRoutes);
app.use('/api/president', presidentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/evaluations', evaluationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
