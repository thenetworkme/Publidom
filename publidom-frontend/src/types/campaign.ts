export interface Campaign {
    id: string;
    title: string;
    description: string;
    requirements?: string | string[]; // Can be JSON string in DB or array if parsed
    budget?: number;
    image_url?: string;
    status: 'active' | 'completed' | 'archived';
    created_at: string;
}
