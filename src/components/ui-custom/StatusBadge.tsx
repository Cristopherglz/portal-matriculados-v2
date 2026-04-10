import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

type StatusType = 'activo' | 'suspendido' | 'baja' | 'al_dia' | 'deuda' | 'pendiente';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusConfig = {
  activo: { icon: CheckCircle, bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200', defaultLabel: 'Activo' },
  suspendido: { icon: AlertCircle, bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200', defaultLabel: 'Suspendido' },
  baja: { icon: XCircle, bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', defaultLabel: 'Dado de Baja' },
  al_dia: { icon: CheckCircle, bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200', defaultLabel: 'Pagado' },
  deuda: { icon: AlertCircle, bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', defaultLabel: 'En Deuda' },
  pendiente: { icon: Clock, bgColor: 'bg-sky-50', textColor: 'text-blue-700', borderColor: 'border-blue-200', defaultLabel: 'Pendiente' },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      <Icon className="w-4 h-4" />
      {label || config.defaultLabel}
    </motion.span>
  );
}
