import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Notificacion } from '@/types';
import { usuariosMock, configuracionSistema } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  solicitarRecuperacion: (email: string) => Promise<{ success: boolean; codigo?: string }>;
  resetPasswordConCodigo: (email: string, codigo: string, newPassword: string) => Promise<boolean>;
  marcarNotificacionLeida: (notificacionId: string) => void;
  enviarNotificacion: (userId: string, notificacion: Omit<Notificacion, 'id' | 'fecha'>) => void;
  crearUsuario: (userData: Omit<User, 'id' | 'notificaciones'> & { password: string }) => Promise<User>;
  actualizarEstadoPago: (userId: string, estado: 'al_dia' | 'deuda', montoDeuda?: number) => void;
  actualizarEstadoUsuario: (userId: string, estado: 'activo' | 'suspendido' | 'baja') => void;
  configuracion: typeof configuracionSistema;
  updateConfiguracion: (config: Partial<typeof configuracionSistema>) => void;
  getUsuariosMatriculados: () => User[];
  getUsuariosAlDia: () => User[];
  updateFotoPerfil: (fotoUrl: string) => void;
  updateUsuarioAdmin: (userId: string, userData: Partial<User>) => void;
  updateFotoPerfilAdmin: (userId: string, fotoUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<User[]>(usuariosMock);
  const [configuracion, setConfiguracion] = useState(configuracionSistema);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('cdg_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('cdg_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cdg_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('cdg_user', JSON.stringify(updatedUser));
      setUsuarios(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (user && user.password === currentPassword) {
      updateUser({ password: newPassword });
      return true;
    }
    return false;
  };

  // Códigos de recuperación en memoria (simulación)
  const [recoveryCodes, setRecoveryCodes] = useState<Record<string, { codigo: string; expira: number }>>({});

  const solicitarRecuperacion = async (email: string): Promise<{ success: boolean; codigo?: string }> => {
    const foundUser = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!foundUser) return { success: false };
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    setRecoveryCodes(prev => ({
      ...prev,
      [email.toLowerCase()]: { codigo, expira: Date.now() + 15 * 60 * 1000 },
    }));
    // Simulación: en producción se enviaría por email
    console.log(`[Recuperación] Código para ${email}: ${codigo}`);
    return { success: true, codigo };
  };

  const resetPasswordConCodigo = async (email: string, codigo: string, newPassword: string): Promise<boolean> => {
    const entry = recoveryCodes[email.toLowerCase()];
    if (!entry || entry.codigo !== codigo || entry.expira < Date.now()) return false;
    setUsuarios(prev => prev.map(u =>
      u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPassword } : u
    ));
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      const updated = { ...user, password: newPassword };
      setUser(updated);
      localStorage.setItem('cdg_user', JSON.stringify(updated));
    }
    setRecoveryCodes(prev => {
      const next = { ...prev };
      delete next[email.toLowerCase()];
      return next;
    });
    return true;
  };

  const marcarNotificacionLeida = (notificacionId: string) => {
    if (user) {
      const updatedNotificaciones = user.notificaciones.map(n =>
        n.id === notificacionId ? { ...n, leida: true } : n
      );
      updateUser({ notificaciones: updatedNotificaciones });
    }
  };

  const enviarNotificacion = (userId: string, notificacion: Omit<Notificacion, 'id' | 'fecha'>) => {
    const newNotificacion: Notificacion = {
      ...notificacion,
      id: Date.now().toString(),
      fecha: new Date().toISOString().split('T')[0],
    };
    setUsuarios(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, notificaciones: [newNotificacion, ...u.notificaciones] }
          : u
      )
    );
    if (user && user.id === userId) {
      updateUser({ notificaciones: [newNotificacion, ...user.notificaciones] });
    }
  };

  const crearUsuario = async (userData: Omit<User, 'id' | 'notificaciones'> & { password: string }): Promise<User> => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      notificaciones: [
        {
          id: 'welcome',
          titulo: 'Bienvenida al Colegio',
          mensaje: 'Tu cuenta ha sido creada exitosamente. Bienvenido al sistema de matrículas.',
          fecha: new Date().toISOString().split('T')[0],
          leida: false,
          tipo: 'success',
        },
      ],
    };
    setUsuarios(prev => [...prev, newUser]);
    return newUser;
  };

  const actualizarEstadoUsuario = (userId: string, estado: 'activo' | 'suspendido' | 'baja') => {
    setUsuarios(prev => prev.map(u => u.id === userId ? { ...u, estado } : u));
    if (user && user.id === userId) {
      updateUser({ estado });
    }
  };

  const updateFotoPerfil = (fotoUrl: string) => {
    if (user) {
      updateUser({ fotoPerfil: fotoUrl });
    }
  };

  const updateUsuarioAdmin = (userId: string, userData: Partial<User>) => {
    setUsuarios(prev => prev.map(u => u.id === userId ? { ...u, ...userData } : u));
    if (user && user.id === userId) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('cdg_user', JSON.stringify(updatedUser));
    }
  };

  const updateFotoPerfilAdmin = (userId: string, fotoUrl: string) => {
    updateUsuarioAdmin(userId, { fotoPerfil: fotoUrl });
  };

  const actualizarEstadoPago = (userId: string, estado: 'al_dia' | 'deuda', montoDeuda?: number) => {
    setUsuarios(prev =>
      prev.map(u =>
        u.id === userId
          ? {
              ...u,
              estadoPago: estado,
              montoDeuda: estado === 'deuda' ? montoDeuda : undefined,
              fechaUltimoPago: estado === 'al_dia' ? new Date().toISOString().split('T')[0] : u.fechaUltimoPago,
            }
          : u
      )
    );
    if (user && user.id === userId) {
      updateUser({
        estadoPago: estado,
        montoDeuda: estado === 'deuda' ? montoDeuda : undefined,
        fechaUltimoPago: estado === 'al_dia' ? new Date().toISOString().split('T')[0] : user.fechaUltimoPago,
      });
    }
  };

  const updateConfiguracion = (config: Partial<typeof configuracionSistema>) => {
    setConfiguracion(prev => ({ ...prev, ...config }));
  };

  const getUsuariosMatriculados = () => usuarios.filter(u => u.tipo === 'matriculado');
  const getUsuariosAlDia = () => usuarios.filter(u => u.tipo === 'matriculado' && u.estadoPago === 'al_dia');

  return (
    <AuthContext.Provider
      value={{
        user, login, logout, isLoading, updateUser, updatePassword,
        marcarNotificacionLeida, enviarNotificacion, crearUsuario,
        actualizarEstadoPago, actualizarEstadoUsuario, configuracion,
        updateConfiguracion, getUsuariosMatriculados, getUsuariosAlDia,
        updateFotoPerfil, updateUsuarioAdmin, updateFotoPerfilAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
