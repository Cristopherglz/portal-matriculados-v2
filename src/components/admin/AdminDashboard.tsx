import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Settings, Search, Plus, Bell, CheckCircle, AlertCircle, TrendingUp, UserCheck, UserX, Ban, Power, Edit, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { AnimatedCounter } from '@/components/ui-custom/AnimatedCounter';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { municipiosMisiones } from '@/data/municipiosMisiones';
import { ContentEditor } from './ContentEditor';
import { UserEditDialog } from './UserEditDialog';
import type { User } from '@/types';

export function AdminDashboard() {
  const { getUsuariosMatriculados, configuracion, updateConfiguracion, crearUsuario, enviarNotificacion, actualizarEstadoPago, actualizarEstadoUsuario } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserData, setNewUserData] = useState({
    nombre: '', apellido: '', email: '', dni: '', ciudad: '', celular: '', domicilio: '', numeroMatricula: '', password: '',
  });

  const usuarios = getUsuariosMatriculados();
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.numeroMatricula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const usuariosActivos = usuarios.filter((u) => u.estado === 'activo');
  const usuariosDeudores = usuarios.filter((u) => u.estadoPago === 'deuda');
  const totalRecaudado = usuarios.filter((u) => u.estadoPago === 'al_dia').reduce((acc) => acc + configuracion.precioMatricula, 0);

  const handleCreateUser = async () => {
    await crearUsuario({
      ...newUserData, tipo: 'matriculado', estado: 'activo', estadoPago: 'deuda',
      montoDeuda: configuracion.precioMatricula, fechaVencimiento: configuracion.fechaVencimientoPago,
    });
    setIsCreateDialogOpen(false);
    setNewUserData({ nombre: '', apellido: '', email: '', dni: '', ciudad: '', celular: '', domicilio: '', numeroMatricula: '', password: '' });
  };

  const handleEditUser = (usuario: User) => { setSelectedUser(usuario); setIsEditDialogOpen(true); };

  const handleEnviarNotificacion = (userId: string, tipo: 'pago' | 'general') => {
    if (tipo === 'pago') {
      enviarNotificacion(userId, { titulo: 'Recordatorio de Pago', mensaje: `Tu matrícula venció. Por favor realizá el pago de $${configuracion.precioMatricula.toLocaleString()}.`, tipo: 'warning', leida: false });
    } else {
      enviarNotificacion(userId, { titulo: 'Notificación del Colegio', mensaje: 'Tenés un mensaje importante del Colegio de Diseñadores Gráficos.', tipo: 'info', leida: false });
    }
  };

  const stats = [
    { label: 'Total Usuarios', value: usuarios.length, icon: Users, color: 'bg-sky-50 text-[#0284c7]' },
    { label: 'Activos', value: usuariosActivos.length, icon: UserCheck, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Deudores', value: usuariosDeudores.length, icon: UserX, color: 'bg-red-50 text-red-600' },
    { label: 'Recaudado', value: totalRecaudado, prefix: '$', icon: DollarSign, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1"><AnimatedCounter value={stat.value} prefix={stat.prefix} /></p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
            </div>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-sky-50">
          <TabsTrigger value="usuarios" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white"><Users className="w-4 h-4 mr-2" />Usuarios</TabsTrigger>
          <TabsTrigger value="configuracion" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white"><Settings className="w-4 h-4 mr-2" />Configuración</TabsTrigger>
          <TabsTrigger value="finanzas" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white"><TrendingUp className="w-4 h-4 mr-2" />Finanzas</TabsTrigger>
          <TabsTrigger value="contenido" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white"><FileEdit className="w-4 h-4 mr-2" />Contenido</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar por nombre, matrícula o ciudad..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white"><Plus className="w-4 h-4 mr-2" />Nuevo Usuario</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Crear Nuevo Usuario Matriculado</DialogTitle></DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2"><Label>Nombre</Label><Input value={newUserData.nombre} onChange={(e) => setNewUserData({ ...newUserData, nombre: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Apellido</Label><Input value={newUserData.apellido} onChange={(e) => setNewUserData({ ...newUserData, apellido: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" value={newUserData.email} onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })} /></div>
                  <div className="space-y-2"><Label>DNI</Label><Input value={newUserData.dni} onChange={(e) => setNewUserData({ ...newUserData, dni: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Matrícula</Label><Input value={newUserData.numeroMatricula} onChange={(e) => setNewUserData({ ...newUserData, numeroMatricula: e.target.value })} placeholder="DG-XXX" /></div>
                  <div className="space-y-2">
                    <Label>Ciudad</Label>
                    <Select value={newUserData.ciudad} onValueChange={(value) => setNewUserData({ ...newUserData, ciudad: value })}>
                      <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                      <SelectContent className="max-h-60">{municipiosMisiones.map((m) => (<SelectItem key={m.id} value={m.nombre}>{m.nombre}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Celular</Label><Input value={newUserData.celular} onChange={(e) => setNewUserData({ ...newUserData, celular: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Domicilio</Label><Input value={newUserData.domicilio} onChange={(e) => setNewUserData({ ...newUserData, domicilio: e.target.value })} /></div>
                  <div className="space-y-2 md:col-span-2"><Label>Contraseña</Label><Input type="password" value={newUserData.password} onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })} /></div>
                </div>
                <Button onClick={handleCreateUser} className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white">Crear Usuario</Button>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead><TableHead>Matrícula</TableHead><TableHead>Ciudad</TableHead>
                  <TableHead>Estado</TableHead><TableHead>Pago</TableHead><TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosFiltrados.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.nombre} {usuario.apellido}</TableCell>
                    <TableCell>{usuario.numeroMatricula}</TableCell>
                    <TableCell>{usuario.ciudad}</TableCell>
                    <TableCell><StatusBadge status={usuario.estado} /></TableCell>
                    <TableCell><StatusBadge status={usuario.estadoPago} /></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(usuario)} title="Editar"><Edit className="w-4 h-4" /></Button>
                        {usuario.estadoPago === 'deuda' && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => actualizarEstadoPago(usuario.id, 'al_dia')} title="Marcar pagado"><CheckCircle className="w-4 h-4 text-emerald-500" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEnviarNotificacion(usuario.id, 'pago')} title="Recordatorio"><Bell className="w-4 h-4 text-amber-500" /></Button>
                          </>
                        )}
                        {usuario.estado === 'activo' && (<Button variant="ghost" size="sm" onClick={() => actualizarEstadoUsuario(usuario.id, 'suspendido')} title="Suspender"><Ban className="w-4 h-4 text-red-500" /></Button>)}
                        {usuario.estado === 'suspendido' && (<Button variant="ghost" size="sm" onClick={() => actualizarEstadoUsuario(usuario.id, 'activo')} title="Activar"><Power className="w-4 h-4 text-emerald-500" /></Button>)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Configuración del Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Precio Matrícula ($)</Label>
                <Input type="number" value={configuracion.precioMatricula} onChange={(e) => updateConfiguracion({ precioMatricula: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Fecha Inicio Pago</Label>
                <Input type="date" value={configuracion.fechaInicioPago} onChange={(e) => updateConfiguracion({ fechaInicioPago: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Fecha Vencimiento</Label>
                <Input type="date" value={configuracion.fechaVencimientoPago} onChange={(e) => updateConfiguracion({ fechaVencimientoPago: e.target.value })} />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="finanzas" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Resumen Financiero</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-emerald-50 rounded-xl"><p className="text-emerald-600 text-sm">Recaudado</p><p className="text-2xl font-bold text-emerald-700">${totalRecaudado.toLocaleString()}</p></div>
              <div className="p-4 bg-red-50 rounded-xl"><p className="text-red-600 text-sm">Pendiente</p><p className="text-2xl font-bold text-red-700">${(usuariosDeudores.length * configuracion.precioMatricula).toLocaleString()}</p></div>
              <div className="p-4 bg-sky-50 rounded-xl"><p className="text-[#0284c7] text-sm">Al día</p><p className="text-2xl font-bold text-[#0284c7]">{usuarios.length > 0 ? Math.round((usuariosActivos.filter(u => u.estadoPago === 'al_dia').length / usuarios.length) * 100) : 0}%</p></div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="contenido">
          <ContentEditor />
        </TabsContent>
      </Tabs>

      <UserEditDialog usuario={selectedUser} isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} />
    </div>
  );
}
