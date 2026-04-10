import { motion } from 'framer-motion';
import { BadgeCheck, AlertTriangle, XCircle } from 'lucide-react';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import type { User } from '@/types';
import { useContent } from '@/context/ContentContext';

interface StatusCardProps {
  user: User;
}

export function StatusCard({ user }: StatusCardProps) {
  const { dashboardContent } = useContent();
  const { cards } = dashboardContent;

  const getStatusIcon = () => {
    switch (user.estado) {
      case 'activo': return <BadgeCheck className="w-8 h-8 text-emerald-500" />;
      case 'suspendido': return <AlertTriangle className="w-8 h-8 text-amber-500" />;
      case 'baja': return <XCircle className="w-8 h-8 text-red-500" />;
      default: return <BadgeCheck className="w-8 h-8 text-emerald-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (user.estado) {
      case 'activo': return 'Tu matrícula se encuentra activa. Podés ejercer tus servicios profesionales.';
      case 'suspendido': return 'Tu matrícula está suspendida. Contactá al administrador para más información.';
      case 'baja': return 'Tu matrícula ha sido dada de baja. Contactá al administrador si deseas reactivarla.';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{cards.estadoMatricula.title}</h3>
        {getStatusIcon()}
      </div>
      <div className="mb-4">
        <StatusBadge status={user.estado} />
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{getStatusMessage()}</p>
      {user.estado === 'activo' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 p-3 bg-emerald-50 rounded-xl">
          <p className="text-emerald-700 text-xs font-medium">✓ Matrícula en regla</p>
        </motion.div>
      )}
    </motion.div>
  );
}
