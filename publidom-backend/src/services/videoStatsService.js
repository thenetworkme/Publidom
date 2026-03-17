/**
 * Video Stats Service
 * Handles URL parsing and video statistics fetching from social platforms
 */

/**
 * Extract platform and video ID from a URL
 * @param {string} url - Video URL from TikTok, Instagram, or YouTube
 * @returns {{ platform: string, videoId: string | null, isValid: boolean }}
 */
const extractVideoInfo = (url) => {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();

        // YouTube
        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            let videoId = null;

            if (hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1);
            } else if (urlObj.pathname.includes('/shorts/')) {
                videoId = urlObj.pathname.split('/shorts/')[1]?.split('/')[0];
            } else {
                videoId = urlObj.searchParams.get('v');
            }

            return { platform: 'youtube', videoId, isValid: !!videoId };
        }

        // TikTok
        if (hostname.includes('tiktok.com')) {
            // Handle various TikTok URL formats
            const pathParts = urlObj.pathname.split('/');
            const videoIndex = pathParts.indexOf('video');

            if (videoIndex !== -1 && pathParts[videoIndex + 1]) {
                return { platform: 'tiktok', videoId: pathParts[videoIndex + 1], isValid: true };
            }

            // Short URL format
            if (hostname.includes('vm.tiktok.com') || hostname.includes('vt.tiktok.com')) {
                return { platform: 'tiktok', videoId: urlObj.pathname.slice(1), isValid: true };
            }

            return { platform: 'tiktok', videoId: null, isValid: false };
        }

        // Instagram
        if (hostname.includes('instagram.com')) {
            const pathParts = urlObj.pathname.split('/');

            // Reels or regular posts
            if (pathParts.includes('reel') || pathParts.includes('p')) {
                const typeIndex = pathParts.includes('reel')
                    ? pathParts.indexOf('reel')
                    : pathParts.indexOf('p');
                const videoId = pathParts[typeIndex + 1];
                return { platform: 'instagram', videoId, isValid: !!videoId };
            }

            return { platform: 'instagram', videoId: null, isValid: false };
        }

        return { platform: 'unknown', videoId: null, isValid: false };

    } catch (error) {
        return { platform: 'unknown', videoId: null, isValid: false };
    }
};

/**
 * Fetch YouTube video statistics using YouTube Data API
 * @param {string} videoId - YouTube video ID
 * @param {string} apiKey - YouTube API key
 * @returns {Promise<{ views: number, likes: number, comments: number } | null>}
 */
const fetchYouTubeStats = async (videoId, apiKey) => {
    if (!apiKey) {
        console.warn('YouTube API key not configured');
        return null;
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            return {
                views: parseInt(stats.viewCount) || 0,
                likes: parseInt(stats.likeCount) || 0,
                comments: parseInt(stats.commentCount) || 0,
                shares: 0 // YouTube doesn't provide share count
            };
        }

        return null;
    } catch (error) {
        console.error('YouTube stats fetch error:', error);
        return null;
    }
};

/**
 * Fetch TikTok video statistics
 * Note: TikTok's official API requires approval. For MVP, this returns mock data.
 * @param {string} videoId - TikTok video ID
 * @returns {Promise<{ views: number, likes: number, comments: number, shares: number } | null>}
 */
const fetchTikTokStats = async (videoId) => {
    // TikTok Research API requires business approval
    // For MVP, return null and let user input manually or use web scraping
    console.log('TikTok stats fetch for:', videoId);
    return null;
};

/**
 * Fetch Instagram video statistics
 * Note: Requires Instagram Graph API with business account
 * @param {string} videoId - Instagram post/reel ID
 * @returns {Promise<{ views: number, likes: number, comments: number } | null>}
 */
const fetchInstagramStats = async (videoId) => {
    // Instagram Graph API requires business account and access token
    // For MVP, return null and let user input manually
    console.log('Instagram stats fetch for:', videoId);
    return null;
};

/**
 * Fetch video stats based on platform
 * @param {string} platform - Platform name (youtube, tiktok, instagram)
 * @param {string} videoId - Video ID
 * @returns {Promise<{ views: number, likes: number, comments: number, shares: number } | null>}
 */
const fetchVideoStats = async (platform, videoId) => {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;

    switch (platform) {
        case 'youtube':
            return await fetchYouTubeStats(videoId, youtubeApiKey);
        case 'tiktok':
            return await fetchTikTokStats(videoId);
        case 'instagram':
            return await fetchInstagramStats(videoId);
        default:
            return null;
    }
};

/**
 * Calculate earnings based on views and campaign rate
 * @param {number} views - Total video views
 * @param {number} costPer1kViews - Campaign's cost per 1000 views
 * @returns {number} - Calculated earnings
 */
const calculateEarnings = (views, costPer1kViews) => {
    if (!views || !costPer1kViews) return 0;
    return (views / 1000) * costPer1kViews;
};

module.exports = {
    extractVideoInfo,
    fetchVideoStats,
    fetchYouTubeStats,
    fetchTikTokStats,
    fetchInstagramStats,
    calculateEarnings
};
