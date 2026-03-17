import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, X } from 'lucide-react';

const campaignSchema = z.object({
    title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    budget: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "El presupuesto debe ser un número positivo",
    }),
    cost_per_1k_views: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "El costo por 1000 views debe ser un número válido",
    }),
    requirements: z.string().min(5, "Especifica al menos un requisito"),
    instructions_url: z.string().url("Debe ser una URL válida").or(z.literal('')).optional(),
});

interface ToastState {
    show: boolean;
    type: 'success' | 'error';
    message: string;
}

export function CreateCampaignForm({ onSuccess }: { onSuccess: () => void }) {
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [toast, setToast] = useState<ToastState>({ show: false, type: 'success', message: '' });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(campaignSchema),
    });

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ show: true, type, message });
        // Auto-hide after 4 seconds
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 4000);
    };

    const onSubmit = async (data: any) => {
        try {
            setUploading(true);
            let imageUrl = null;

            // 1. Upload Image if exists
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('campaign-banners')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('campaign-banners')
                    .getPublicUrl(filePath);

                imageUrl = publicUrlData.publicUrl;
            }

            // 2. Insert Campaign
            const { error: insertError } = await supabase
                .from('campaigns')
                .insert({
                    title: data.title,
                    description: data.description,
                    budget: Number(data.budget),
                    cost_per_1k_views: Number(data.cost_per_1k_views) || 0,
                    requirements: JSON.stringify(data.requirements.split('\n').filter((r: string) => r.trim() !== '')),
                    instructions_url: data.instructions_url || null,
                    image_url: imageUrl,
                    status: 'active'
                });

            if (insertError) throw insertError;

            reset();
            setImageFile(null);
            showToast('success', 'Campaña creada exitosamente');

            // Delay onSuccess to let the user see the toast
            setTimeout(() => {
                onSuccess();
            }, 1500);

        } catch (error: any) {
            console.error('Error creating campaign:', error);
            showToast('error', 'Error al crear campaña: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 animate-in slide-in-from-top-5 ${toast.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                    {toast.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={() => setToast(prev => ({ ...prev, show: false }))}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Nueva Campaña</CardTitle>
                    <CardDescription>Sube una nueva campaña para que los usuarios la vean.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="title">Título de la Campaña</Label>
                            <Input id="title" {...register('title')} placeholder="Ej: Verano 2024" />
                            {errors.title && <span className="text-red-500 text-sm">{String(errors.title.message)}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea id="description" {...register('description')} placeholder="Detalles de la campaña..." />
                            {errors.description && <span className="text-red-500 text-sm">{String(errors.description.message)}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Presupuesto Total ($)</Label>
                                <Input id="budget" type="number" step="0.01" {...register('budget')} placeholder="1000.00" />
                                {errors.budget && <span className="text-red-500 text-sm">{String(errors.budget.message)}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cost_per_1k_views">Pago por 1000 views ($)</Label>
                                <Input id="cost_per_1k_views" type="number" step="0.01" {...register('cost_per_1k_views')} placeholder="5.00" />
                                {errors.cost_per_1k_views && <span className="text-red-500 text-sm">{String(errors.cost_per_1k_views.message)}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requirements">Requisitos (uno por línea)</Label>
                            <Textarea id="requirements" {...register('requirements')} placeholder="- Tener 1000 seguidores&#10;- Ser mayor de edad" />
                            {errors.requirements && <span className="text-red-500 text-sm">{String(errors.requirements.message)}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="instructions_url">Link de instrucciones (opcional)</Label>
                            <Input id="instructions_url" type="url" {...register('instructions_url')} placeholder="https://example.com/instrucciones" />
                            {errors.instructions_url && <span className="text-red-500 text-sm">{String(errors.instructions_url.message)}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Banner / Imagen</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            />
                        </div>

                        <Button type="submit" disabled={uploading} className="w-full">
                            {uploading ? 'Subiendo...' : 'Publicar Campaña'}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
