const supabase = require('../config/supabase');

const getStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user stats
        const { data: stats, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Stats fetch error:', error);
            return res.status(500).json({ error: 'Failed to fetch stats' });
        }

        // Get social profiles count
        const { count: profilesCount } = await supabase
            .from('social_profiles')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId);

        // Get total posts from social profiles
        const { data: profiles } = await supabase
            .from('social_profiles')
            .select('posts_count')
            .eq('user_id', userId);

        const totalPosts = profiles?.reduce((sum, p) => sum + (p.posts_count || 0), 0) || 0;

        // Get total followers from social profiles
        const totalFollowers = profiles?.reduce((sum, p) => sum + (p.followers_count || 0), 0) || 0;

        // Return stats (use db stats or calculate from current data)
        res.json({
            total_profiles: profilesCount || 0,
            total_posts: totalPosts,
            total_followers: totalFollowers,
            total_views: stats?.total_views || 0,
            average_views: parseFloat(stats?.average_views || 0)
        });

    } catch (err) {
        console.error('Get stats error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getStats };
