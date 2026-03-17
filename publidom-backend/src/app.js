const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');
const clipsRoutes = require('./routes/clipsRoutes');
const campaignRoutes = require('./routes/campaigns');
const submissionRoutes = require('./routes/submissions');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/clips', clipsRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/submissions', submissionRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('Publidom Backend is running!');
});

module.exports = app;

