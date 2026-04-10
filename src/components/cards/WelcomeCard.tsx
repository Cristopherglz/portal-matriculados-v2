import { motion } from 'framer-motion';
import { User, Calendar, Sparkles } from 'lucide-react';
import type { User as UserType } from '@/types';

interface WelcomeCardProps {
  user: UserType;
}

export function WelcomeCard({ user }: WelcomeCardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20"
    >
      <div className="flex items-start justify-between">
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span className="text-blue-100 text-sm">{getGreeting()}</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-bold mb-1">
            {user.nombre} {user.apellido}
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-blue-100 text-sm">
            {user.tipo === 'administrador' ? 'Administrador del Sistema' : 'Diseñador Gráfico Matriculado'}
          </motion.p>
        </div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }} className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center">
          {user.fotoPerfil ? (
            <img src={user.fotoPerfil} alt="Foto de perfil" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-white" />
          )}
        </motion.div>
      </div>
      {user.numeroMatricula && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2 text-sm text-blue-100 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Número de Matrícula</span>
          </div>
          <p className="text-3xl font-bold tracking-wider">{user.numeroMatricula}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
