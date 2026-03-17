export interface Campaign {
    id: string;
    title: string;
    description: string;
    requirements?: string | string[]; // Can be JSON string in DB or array if parsed
    budget?: number;
    cost_per_1k_views?: number;
    instructions_url?: string;
    image_url?: string;
    status: 'active' | 'completed' | 'archived';
    created_at: string;
}
