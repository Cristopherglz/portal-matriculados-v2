import { Shield, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function SecureBadge({ variant = 'default' }: { variant?: 'default' | 'compact' | 'banner' }) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"
      >
        <Lock className="w-3 h-3" />
        <span>Seguro</span>
      </motion.div>
    );
  }

  if (variant === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg"
      >
        <div className="p-2 bg-white/20 rounded-full">
          <Shield className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="font-semibold text-sm">Sistema Seguro</p>
          <p className="text-xs text-white/80">Conexión encriptada SSL</p>
        </div>
        <CheckCircle className="w-5 h-5 text-white/90" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 text-emerald-700 rounded-full border border-emerald-200 shadow-sm"
    >
      <Shield className="w-4 h-4" />
      <span className="text-sm font-medium">Sistema Seguro</span>
      <Lock className="w-3 h-3 text-emerald-500" />
    </motion.div>
  );
}
