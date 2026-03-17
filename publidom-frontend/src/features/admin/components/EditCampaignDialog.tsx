import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Campaign } from '@/types/campaign';
// Simple Dialog/Modal implementation using fixed positioning since we might not have a full Dialog component ready
// In a real app, use @radix-ui/react-dialog or shadcn/ui Dialog

const campaignSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    budget: z.string().or(z.number()).transform(val => String(val)), // Handle both number (from DB) and string (from input)
    cost_per_1k_views: z.string().or(z.number()).transform(val => String(val)),
    requirements: z.string(),
    instructions_url: z.string().url().or(z.literal('')).optional(),
    status: z.enum(['active', 'completed', 'archived'])
});

export function EditCampaignDialog({ campaign, open, onClose, onSuccess }: { campaign: Campaign | null, open: boolean, onClose: () => void, onSuccess: () => void }) {
    const [saving, setSaving] = useState(false);

    const { register, handleSubmit, reset } = useForm({
        resolver: zodResolver(campaignSchema),
    });

    useEffect(() => {
        if (campaign) {
            // Format requirements from JSON/Array to string
            let reqString = '';
            if (Array.isArray(campaign.requirements)) {
                reqString = campaign.requirements.join('\n');
            } else if (typeof campaign.requirements === 'string') {
                try {
                    const parsed = JSON.parse(campaign.requirements);
                    reqString = Array.isArray(parsed) ? parsed.join('\n') : campaign.requirements;
                } catch {
                    reqString = campaign.requirements;
                }
            }

            reset({
                title: campaign.title,
                description: campaign.description,
                budget: campaign.budget,
                cost_per_1k_views: campaign.cost_per_1k_views || 0,
                requirements: reqString,
                instructions_url: campaign.instructions_url || '',
                status: campaign.status
            });
        }
    }, [campaign, reset]);

    const onSubmit = async (data: any) => {
        if (!campaign) return;

        try {
            setSaving(true);

            const { error } = await supabase
                .from('campaigns')
                .update({
                    title: data.title,
                    description: data.description,
                    budget: Number(data.budget),
                    cost_per_1k_views: Number(data.cost_per_1k_views) || 0,
                    requirements: JSON.stringify(data.requirements.split('\n').filter((r: string) => r.trim() !== '')),
                    instructions_url: data.instructions_url || null,
                    status: data.status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', campaign.id);

            if (error) throw error;
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Update error:', error);
            alert('Error updating: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (!open || !campaign) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold mb-4">Editar Campaña</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Título</Label>
                        <Input {...register('title')} />
                    </div>

                    <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea {...register('description')} className="h-24" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Presupuesto Total</Label>
                            <Input {...register('budget')} type="number" step="0.01" />
                        </div>
                        <div className="space-y-2">
                            <Label>Pago por 1000 views</Label>
                            <Input {...register('cost_per_1k_views')} type="number" step="0.01" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Estado</Label>
                        <select {...register('status')} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="active">Activa</option>
                            <option value="completed">Completada</option>
                            <option value="archived">Archivada</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Requisitos (uno por línea)</Label>
                        <Textarea {...register('requirements')} />
                    </div>

                    <div className="space-y-2">
                        <Label>Link de instrucciones (opcional)</Label>
                        <Input {...register('instructions_url')} type="url" placeholder="https://example.com/instrucciones" />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
