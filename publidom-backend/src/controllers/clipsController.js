const supabase = require('../config/supabase');

const getClips = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 10, sortBy = 'views_count' } = req.query;

        const { data: clips, error } = await supabase
            .from('clips')
            .select('*')
            .eq('user_id', userId)
            .order(sortBy, { ascending: false })
            .limit(parseInt(limit));

        if (error) {
            console.error('Clips fetch error:', error);
            return res.status(500).json({ error: 'Failed to fetch clips' });
        }

        res.json(clips || []);

    } catch (err) {
        console.error('Get clips error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createClip = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            title,
            url,
            platform,
            platform_clip_id,
            thumbnail_url,
            views_count = 0,
            likes_count = 0,
            comments_count = 0,
            duration_seconds,
            published_at
        } = req.body;

        if (!url || !platform || !platform_clip_id) {
            return res.status(400).json({ error: 'URL, platform, and platform_clip_id are required' });
        }

        const { data: clip, error } = await supabase
            .from('clips')
            .insert({
                user_id: userId,
                title,
                url,
                platform,
                platform_clip_id,
                thumbnail_url,
                views_count,
                likes_count,
                comments_count,
                duration_seconds,
                published_at
            })
            .select()
            .single();

        if (error) {
            console.error('Clip creation error:', error);
            return res.status(500).json({ error: 'Failed to create clip' });
        }

        res.status(201).json(clip);

    } catch (err) {
        console.error('Create clip error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateClip = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const updates = req.body;

        // Verify ownership
        const { data: existing } = await supabase
            .from('clips')
            .select('user_id')
            .eq('id', id)
            .single();

        if (!existing || existing.user_id !== userId) {
            return res.status(404).json({ error: 'Clip not found' });
        }

        const { data: clip, error } = await supabase
            .from('clips')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Clip update error:', error);
            return res.status(500).json({ error: 'Failed to update clip' });
        }

        res.json(clip);

    } catch (err) {
        console.error('Update clip error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteClip = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Verify ownership
        const { data: existing } = await supabase
            .from('clips')
            .select('user_id')
            .eq('id', id)
            .single();

        if (!existing || existing.user_id !== userId) {
            return res.status(404).json({ error: 'Clip not found' });
        }

        const { error } = await supabase
            .from('clips')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Clip deletion error:', error);
            return res.status(500).json({ error: 'Failed to delete clip' });
        }

        res.json({ message: 'Clip deleted successfully' });

    } catch (err) {
        console.error('Delete clip error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getClips, createClip, updateClip, deleteClip };
