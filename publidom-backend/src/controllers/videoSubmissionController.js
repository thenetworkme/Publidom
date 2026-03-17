const supabase = require('../config/supabase');
const { extractVideoInfo, fetchVideoStats, calculateEarnings } = require('../services/videoStatsService');

/**
 * Submit a video URL for a campaign
 */
const submitVideo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { campaignId, videoUrl } = req.body;

        if (!campaignId || !videoUrl) {
            return res.status(400).json({ error: 'Campaign ID and video URL are required' });
        }

        // Verify user is participating in campaign
        const { data: participation } = await supabase
            .from('campaign_participants')
            .select('user_id')
            .eq('user_id', userId)
            .eq('campaign_id', campaignId)
            .single();

        if (!participation) {
            return res.status(403).json({ error: 'You must join the campaign first' });
        }

        // Extract video info from URL
        const videoInfo = extractVideoInfo(videoUrl);

        if (!videoInfo.isValid) {
            return res.status(400).json({
                error: 'Invalid video URL. Please provide a valid YouTube, TikTok, or Instagram URL'
            });
        }

        // Check if video already submitted for this campaign
        const { data: existing } = await supabase
            .from('video_submissions')
            .select('id')
            .eq('user_id', userId)
            .eq('campaign_id', campaignId)
            .eq('video_url', videoUrl)
            .single();

        if (existing) {
            return res.status(400).json({ error: 'This video has already been submitted for this campaign' });
        }

        // Try to fetch initial stats
        const stats = await fetchVideoStats(videoInfo.platform, videoInfo.videoId);

        // Get campaign's cost_per_1k_views
        const { data: campaign } = await supabase
            .from('campaigns')
            .select('cost_per_1k_views')
            .eq('id', campaignId)
            .single();

        const earnings = stats ? calculateEarnings(stats.views, campaign?.cost_per_1k_views) : 0;

        // Insert submission
        const { data: submission, error } = await supabase
            .from('video_submissions')
            .insert({
                user_id: userId,
                campaign_id: campaignId,
                video_url: videoUrl,
                platform: videoInfo.platform,
                platform_video_id: videoInfo.videoId,
                views_count: stats?.views || 0,
                likes_count: stats?.likes || 0,
                comments_count: stats?.comments || 0,
                shares_count: stats?.shares || 0,
                earnings: earnings,
                status: 'pending',
                last_stats_update: stats ? new Date().toISOString() : null
            })
            .select()
            .single();

        if (error) {
            console.error('Video submission error:', error);
            return res.status(500).json({ error: 'Failed to submit video' });
        }

        res.status(201).json(submission);

    } catch (err) {
        console.error('Submit video error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get all submissions for current user
 */
const getUserSubmissions = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('video_submissions')
            .select(`
                *,
                campaigns (
                    id,
                    title,
                    image_url,
                    cost_per_1k_views
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get submissions error:', error);
            return res.status(500).json({ error: 'Failed to fetch submissions' });
        }

        res.json(data || []);

    } catch (err) {
        console.error('Get submissions error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get submissions for a specific campaign
 */
const getSubmissionsByCampaign = async (req, res) => {
    try {
        const userId = req.user.id;
        const { campaignId } = req.params;

        const { data, error } = await supabase
            .from('video_submissions')
            .select('*')
            .eq('user_id', userId)
            .eq('campaign_id', campaignId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get campaign submissions error:', error);
            return res.status(500).json({ error: 'Failed to fetch submissions' });
        }

        res.json(data || []);

    } catch (err) {
        console.error('Get campaign submissions error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Refresh stats for a submission
 */
const refreshVideoStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Get submission
        const { data: submission, error: fetchError } = await supabase
            .from('video_submissions')
            .select(`
                *,
                campaigns (cost_per_1k_views)
            `)
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (fetchError || !submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        // Fetch fresh stats
        const stats = await fetchVideoStats(submission.platform, submission.platform_video_id);

        if (!stats) {
            return res.status(503).json({
                error: 'Could not fetch stats. API may not be available for this platform.'
            });
        }

        const earnings = calculateEarnings(stats.views, submission.campaigns?.cost_per_1k_views);

        // Update submission
        const { data: updated, error: updateError } = await supabase
            .from('video_submissions')
            .update({
                views_count: stats.views,
                likes_count: stats.likes,
                comments_count: stats.comments,
                shares_count: stats.shares || 0,
                earnings: earnings,
                last_stats_update: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Stats update error:', updateError);
            return res.status(500).json({ error: 'Failed to update stats' });
        }

        res.json(updated);

    } catch (err) {
        console.error('Refresh stats error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get aggregated stats for dashboard
 */
const getAggregatedStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('video_submissions')
            .select('views_count, likes_count, comments_count, earnings')
            .eq('user_id', userId);

        if (error) {
            console.error('Aggregated stats error:', error);
            return res.status(500).json({ error: 'Failed to fetch stats' });
        }

        const stats = (data || []).reduce((acc, sub) => ({
            totalViews: acc.totalViews + (sub.views_count || 0),
            totalLikes: acc.totalLikes + (sub.likes_count || 0),
            totalComments: acc.totalComments + (sub.comments_count || 0),
            totalEarnings: acc.totalEarnings + parseFloat(sub.earnings || 0),
            totalSubmissions: acc.totalSubmissions + 1
        }), {
            totalViews: 0,
            totalLikes: 0,
            totalComments: 0,
            totalEarnings: 0,
            totalSubmissions: 0
        });

        res.json(stats);

    } catch (err) {
        console.error('Aggregated stats error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    submitVideo,
    getUserSubmissions,
    getSubmissionsByCampaign,
    refreshVideoStats,
    getAggregatedStats
};
