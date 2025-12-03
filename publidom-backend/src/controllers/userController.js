const supabase = require('../config/supabase');

const getProfile = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json(data);
    } catch (err) {
        console.error('Get Profile Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const updates = req.body;

        // Remove fields that shouldn't be updated directly via this endpoint
        delete updates.id;
        delete updates.created_at;

        const { data, error } = await supabase
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date()
            })
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json(data);
    } catch (err) {
        console.error('Update Profile Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getProfile, updateProfile };
