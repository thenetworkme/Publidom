import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconPencil, IconRefresh } from "@tabler/icons-react";

export function PersonalInfo({ user }: { user: any }) {
    if (!user) return null;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Información personal</h2>
            </div>

            {/* Profile Picture */}
            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-500">Foto de perfil</label>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 bg-gray-100">
                        <AvatarFallback className="bg-gray-100 text-gray-900 font-medium text-xl">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-gray-900">{user.first_name} {user.last_name}</h3>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                </div>
                <Button variant="outline" className="gap-2 rounded-full bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600 font-medium">
                    <IconRefresh className="w-4 h-4" />
                    Reemplazar foto
                </Button>
            </div>

            <div className="border-t border-gray-100" />

            {/* Name */}
            <div className="grid grid-cols-2 gap-8 group cursor-pointer hover:bg-gray-50/50 p-2 -mx-2 rounded-lg transition-colors">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Nombre</label>
                    <p className="font-medium text-gray-900">{user.first_name}</p>
                </div>
                <div className="space-y-1 relative">
                    <label className="text-sm font-medium text-gray-500">Apellido</label>
                    <p className="font-medium text-gray-900">{user.last_name}</p>
                    <IconPencil className="w-4 h-4 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Username */}
            <div className="group cursor-pointer hover:bg-gray-50/50 p-2 -mx-2 rounded-lg transition-colors relative">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Nombre de usuario</label>
                    <p className="font-medium text-gray-900">@{user.username}</p>
                </div>
                <IconPencil className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="border-t border-gray-100" />

            {/* Location */}
            <div className="group cursor-pointer hover:bg-gray-50/50 p-2 -mx-2 rounded-lg transition-colors relative">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Ubicación</label>
                    <p className="font-medium text-gray-900">{user.location || 'No especificada'}</p>
                </div>
                <IconPencil className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="border-t border-gray-100" />

            {/* Languages */}
            <div className="group cursor-pointer hover:bg-gray-50/50 p-2 -mx-2 rounded-lg transition-colors relative">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Idiomas en los que publicas</label>
                    <p className="font-medium text-gray-900">{user.languages?.join(', ') || 'No especificados'}</p>
                </div>
                <IconPencil className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="border-t border-gray-100" />

            {/* Email - Note: Email is not in profile table, but we can display it if we fetched it or leave it static/hidden for now as it wasn't in the profile response unless we joined. 
               Wait, I didn't add email to profile table insert. And I didn't join auth.users in getProfile.
               So user.email will be undefined.
               I should probably fetch email from auth.users or just hide it/show placeholder.
               For now, I'll remove it or show placeholder.
            */}
        </div>
    );
}
