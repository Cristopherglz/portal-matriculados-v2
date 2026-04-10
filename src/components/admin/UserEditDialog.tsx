import { useState, useEffect } from 'react';
import { Camera, User as UserIcon, Mail, Phone, MapPin, CreditCard, Instagram, Facebook, Linkedin, Globe, Palette, Building2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { municipiosMisiones } from '@/data/municipiosMisiones';
import type { User } from '@/types';

interface UserEditDialogProps {
  usuario: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserEditDialog({ usuario, isOpen, onClose }: UserEditDialogProps) {
  const { updateUsuarioAdmin, updateFotoPerfilAdmin } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', dni: '', ciudad: '', celular: '', domicilio: '', estudio: '', numeroMatricula: '',
    instagram: '', facebook: '', paginaWeb: '', linkedin: '', behance: '',
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '', apellido: usuario.apellido || '', email: usuario.email || '',
        dni: usuario.dni || '', ciudad: usuario.ciudad || '', celular: usuario.celular || '',
        domicilio: usuario.domicilio || '', estudio: usuario.estudio || '', numeroMatricula: usuario.numeroMatricula || '',
        instagram: usuario.redes?.instagram || '', facebook: usuario.redes?.facebook || '',
        paginaWeb: usuario.redes?.paginaWeb || '', linkedin: usuario.redes?.linkedin || '', behance: usuario.redes?.behance || '',
      });
    }
  }, [usuario]);

  const handleSave = () => {
    if (!usuario) return;
    updateUsuarioAdmin(usuario.id, {
      nombre: formData.nombre, apellido: formData.apellido, email: formData.email,
      dni: formData.dni, ciudad: formData.ciudad, celular: formData.celular,
      domicilio: formData.domicilio, estudio: formData.estudio, numeroMatricula: formData.numeroMatricula,
      redes: { instagram: formData.instagram, facebook: formData.facebook, paginaWeb: formData.paginaWeb, linkedin: formData.linkedin, behance: formData.behance },
    });
    onClose();
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && usuario) {
      const reader = new FileReader();
      reader.onloadend = () => { updateFotoPerfilAdmin(usuario.id, reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  if (!usuario) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuario: {usuario.nombre} {usuario.apellido}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center">
                {usuario.fotoPerfil ? (
                  <img src={usuario.fotoPerfil} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-2xl font-bold">{usuario.nombre[0]}{usuario.apellido[0]}</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-[#0ea5e9] text-white rounded-full cursor-pointer hover:bg-[#0284c7] shadow-lg">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="flex items-center gap-2"><UserIcon className="w-4 h-4 text-[#0ea5e9]" />Nombre</Label><Input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><UserIcon className="w-4 h-4 text-[#0ea5e9]" />Apellido</Label><Input value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#0ea5e9]" />Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#0ea5e9]" />DNI</Label><Input value={formData.dni} onChange={(e) => setFormData({ ...formData, dni: e.target.value })} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#0ea5e9]" />Matrícula</Label><Input value={formData.numeroMatricula} onChange={(e) => setFormData({ ...formData, numeroMatricula: e.target.value })} placeholder="DG-XXX" /></div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#0ea5e9]" />Ciudad</Label>
              <Select value={formData.ciudad} onValueChange={(value) => setFormData({ ...formData, ciudad: value })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar ciudad" /></SelectTrigger>
                <SelectContent className="max-h-60">{municipiosMisiones.map((m) => (<SelectItem key={m.id} value={m.nombre}>{m.nombre}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#0ea5e9]" />Celular</Label><Input value={formData.celular} onChange={(e) => setFormData({ ...formData, celular: e.target.value })} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#0ea5e9]" />Domicilio</Label><Input value={formData.domicilio} onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })} /></div>
            <div className="space-y-2 md:col-span-2"><Label className="flex items-center gap-2"><Building2 className="w-4 h-4 text-[#0ea5e9]" />Estudio</Label><Input value={formData.estudio} onChange={(e) => setFormData({ ...formData, estudio: e.target.value })} /></div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-4">Redes Sociales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500" />Instagram</Label><Input value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="@usuario" /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-600" />Facebook</Label><Input value={formData.facebook} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><Globe className="w-4 h-4 text-emerald-500" />Web</Label><Input value={formData.paginaWeb} onChange={(e) => setFormData({ ...formData, paginaWeb: e.target.value })} /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-blue-700" />LinkedIn</Label><Input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><Palette className="w-4 h-4 text-blue-500" />Behance</Label><Input value={formData.behance} onChange={(e) => setFormData({ ...formData, behance: e.target.value })} /></div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white"><Save className="w-4 h-4 mr-2" />Guardar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
