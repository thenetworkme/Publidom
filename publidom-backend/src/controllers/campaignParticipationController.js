const supabase = require('../config/supabase');

/**
 * Join a campaign
 */
const joinCampaign = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: campaignId } = req.params;

        if (!campaignId) {
            return res.status(400).json({ error: 'Campaign ID is required' });
        }

        // Check if campaign exists and is active
        const { data: campaign, error: campaignError } = await supabase
            .from('campaigns')
            .select('id, status')
            .eq('id', campaignId)
            .single();

        if (campaignError || !campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        if (campaign.status !== 'active') {
            return res.status(400).json({ error: 'Campaign is not active' });
        }

        // Check if already joined
        const { data: existing } = await supabase
            .from('campaign_participants')
            .select('user_id')
            .eq('user_id', userId)
            .eq('campaign_id', campaignId)
            .single();

        if (existing) {
            return res.status(400).json({ error: 'Already joined this campaign' });
        }

        // Join campaign
        const { data, error } = await supabase
            .from('campaign_participants')
            .insert({
                user_id: userId,
                campaign_id: campaignId,
                status: 'active'
            })
            .select()
            .single();

        if (error) {
            console.error('Join campaign error:', error);
            return res.status(500).json({ error: 'Failed to join campaign' });
        }

        res.status(201).json({ message: 'Successfully joined campaign', data });

    } catch (err) {
        console.error('Join campaign error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Leave a campaign
 */
const leaveCampaign = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: campaignId } = req.params;

        const { error } = await supabase
            .from('campaign_participants')
            .delete()
            .eq('user_id', userId)
            .eq('campaign_id', campaignId);

        if (error) {
            console.error('Leave campaign error:', error);
            return res.status(500).json({ error: 'Failed to leave campaign' });
        }

        res.json({ message: 'Successfully left campaign' });

    } catch (err) {
        console.error('Leave campaign error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get user's joined campaigns
 */
const getUserCampaigns = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('campaign_participants')
            .select(`
                campaign_id,
                joined_at,
                status,
                campaigns (
                    id,
                    title,
                    description,
                    image_url,
                    budget,
                    cost_per_1k_views,
                    instructions_url,
                    status,
                    created_at
                )
            `)
            .eq('user_id', userId)
            .eq('status', 'active');

        if (error) {
            console.error('Get user campaigns error:', error);
            return res.status(500).json({ error: 'Failed to fetch campaigns' });
        }

        // Flatten the response
        const campaigns = data.map(item => ({
            ...item.campaigns,
            joined_at: item.joined_at,
            participation_status: item.status
        }));

        res.json(campaigns);

    } catch (err) {
        console.error('Get user campaigns error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Check if user is in a campaign
 */
const getParticipationStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: campaignId } = req.params;

        const { data, error } = await supabase
            .from('campaign_participants')
            .select('user_id, status, joined_at')
            .eq('user_id', userId)
            .eq('campaign_id', campaignId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error('Participation status error:', error);
            return res.status(500).json({ error: 'Failed to check status' });
        }

        res.json({
            isParticipating: !!data,
            status: data?.status || null,
            joinedAt: data?.joined_at || null
        });

    } catch (err) {
        console.error('Participation status error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    joinCampaign,
    leaveCampaign,
    getUserCampaigns,
    getParticipationStatus
};
