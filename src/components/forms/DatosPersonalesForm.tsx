import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, CreditCard, Lock, Instagram, Facebook, Linkedin, Globe, Palette, Save, X, Eye, EyeOff, Camera, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { municipiosMisiones } from '@/data/municipiosMisiones';

export function DatosPersonalesForm() {
  const { user, updateUser, updatePassword, updateFotoPerfil } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '', apellido: user?.apellido || '', dni: user?.dni || '',
    ciudad: user?.ciudad || '', celular: user?.celular || '', email: user?.email || '',
    domicilio: user?.domicilio || '', estudio: user?.estudio || '',
    instagram: user?.redes?.instagram || '', facebook: user?.redes?.facebook || '',
    paginaWeb: user?.redes?.paginaWeb || '', linkedin: user?.redes?.linkedin || '',
    behance: user?.redes?.behance || '',
  });

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleSave = () => {
    updateUser({
      nombre: formData.nombre, apellido: formData.apellido, dni: formData.dni,
      ciudad: formData.ciudad, celular: formData.celular, email: formData.email,
      domicilio: formData.domicilio, estudio: formData.estudio,
      redes: { instagram: formData.instagram, facebook: formData.facebook, paginaWeb: formData.paginaWeb, linkedin: formData.linkedin, behance: formData.behance },
    });
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (passwordData.newPassword !== passwordData.confirmPassword) { setPasswordError('Las contraseñas no coinciden'); return; }
    if (passwordData.newPassword.length < 6) { setPasswordError('La contraseña debe tener al menos 6 caracteres'); return; }
    const success = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
    if (success) {
      setPasswordSuccess('Contraseña actualizada correctamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordError('La contraseña actual es incorrecta');
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user?.nombre || '', apellido: user?.apellido || '', dni: user?.dni || '',
      ciudad: user?.ciudad || '', celular: user?.celular || '', email: user?.email || '',
      domicilio: user?.domicilio || '', estudio: user?.estudio || '',
      instagram: user?.redes?.instagram || '', facebook: user?.redes?.facebook || '',
      paginaWeb: user?.redes?.paginaWeb || '', linkedin: user?.redes?.linkedin || '',
      behance: user?.redes?.behance || '',
    });
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0ea5e9]/10 rounded-xl"><User className="w-6 h-6 text-[#0ea5e9]" /></div>
          <h3 className="text-lg font-semibold text-gray-800">Mis Datos Personales</h3>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-white">Editar</Button>
        )}
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center">
            {user?.fotoPerfil ? (
              <img src={user.fotoPerfil} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-2xl font-bold">{user?.nombre?.[0]}{user?.apellido?.[0]}</span>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 bg-[#0ea5e9] text-white rounded-full cursor-pointer hover:bg-[#0284c7] transition-colors shadow-lg">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) { const reader = new FileReader(); reader.onloadend = () => { updateFotoPerfil(reader.result as string); }; reader.readAsDataURL(file); }
            }} />
          </label>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-sky-50">
          <TabsTrigger value="personal" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white">Personales</TabsTrigger>
          <TabsTrigger value="contacto" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white">Contacto</TabsTrigger>
          <TabsTrigger value="redes" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white">Redes</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Nombre</Label>
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} disabled={!isEditing} className="pl-10" /></div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Apellido</Label>
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} disabled={!isEditing} className="pl-10" /></div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">DNI</Label>
              <div className="relative"><CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input value={formData.dni} onChange={(e) => setFormData({ ...formData, dni: e.target.value })} disabled={!isEditing} className="pl-10" /></div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Ciudad</Label>
              {isEditing ? (
                <Select value={formData.ciudad} onValueChange={(value) => setFormData({ ...formData, ciudad: value })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar ciudad" /></SelectTrigger>
                  <SelectContent className="max-h-60">{municipiosMisiones.map((m) => (<SelectItem key={m.id} value={m.nombre}>{m.nombre}</SelectItem>))}</SelectContent>
                </Select>
              ) : (
                <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input value={formData.ciudad} disabled className="pl-10" /></div>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-gray-700 flex items-center gap-2"><Building2 className="w-4 h-4 text-[#0ea5e9]" />Estudio / Empresa</Label>
              <Input value={formData.estudio} onChange={(e) => setFormData({ ...formData, estudio: e.target.value })} disabled={!isEditing} placeholder="Nombre del estudio" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contacto" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Email</Label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!isEditing} className="pl-10" /></div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Celular</Label>
              <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input value={formData.celular} onChange={(e) => setFormData({ ...formData, celular: e.target.value })} disabled={!isEditing} className="pl-10" /></div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-gray-700">Domicilio</Label>
              <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input value={formData.domicilio} onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })} disabled={!isEditing} className="pl-10" /></div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-[#0ea5e9]" />Cambiar Contraseña</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Contraseña actual</Label>
                <div className="relative">
                  <Input type={showCurrentPassword ? 'text' : 'password'} value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nueva contraseña</Label>
                <div className="relative">
                  <Input type={showNewPassword ? 'text' : 'password'} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confirmar</Label>
                <div className="relative">
                  <Input type={showConfirmPassword ? 'text' : 'password'} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
            </div>
            {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
            {passwordSuccess && <p className="text-emerald-500 text-sm mt-2">{passwordSuccess}</p>}
            <Button onClick={handlePasswordChange} className="mt-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white">Cambiar Contraseña</Button>
          </div>
        </TabsContent>

        <TabsContent value="redes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500" />Instagram</Label>
              <Input value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} disabled={!isEditing} placeholder="@usuario" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-600" />Facebook</Label>
              <Input value={formData.facebook} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} disabled={!isEditing} placeholder="Página" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Globe className="w-4 h-4 text-emerald-500" />Página Web</Label>
              <Input value={formData.paginaWeb} onChange={(e) => setFormData({ ...formData, paginaWeb: e.target.value })} disabled={!isEditing} placeholder="www.tusitio.com" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-blue-700" />LinkedIn</Label>
              <Input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} disabled={!isEditing} placeholder="perfil" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Palette className="w-4 h-4 text-blue-500" />Behance</Label>
              <Input value={formData.behance} onChange={(e) => setFormData({ ...formData, behance: e.target.value })} disabled={!isEditing} placeholder="usuario" />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {isEditing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mt-6 pt-6 border-t">
          <Button onClick={handleSave} className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white"><Save className="w-4 h-4 mr-2" />Guardar Cambios</Button>
          <Button onClick={handleCancel} variant="outline"><X className="w-4 h-4 mr-2" />Cancelar</Button>
        </motion.div>
      )}
    </motion.div>
  );
}
