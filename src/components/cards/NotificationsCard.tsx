import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Notificacion } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';

interface NotificationsCardProps {
  notificaciones: Notificacion[];
}

const getNotificationIcon = (tipo: Notificacion['tipo']) => {
  switch (tipo) {
    case 'info': return <Info className="w-5 h-5 text-blue-500" />;
    case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
    default: return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const getNotificationBg = (tipo: Notificacion['tipo']) => {
  switch (tipo) {
    case 'info': return 'bg-sky-50 border-blue-100';
    case 'warning': return 'bg-amber-50 border-amber-100';
    case 'success': return 'bg-emerald-50 border-emerald-100';
    case 'error': return 'bg-red-50 border-red-100';
    default: return 'bg-gray-50 border-gray-100';
  }
};

export function NotificationsCard({ notificaciones }: NotificationsCardProps) {
  const { marcarNotificacionLeida } = useAuth();
  const { dashboardContent } = useContent();
  const { cards } = dashboardContent;

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida);
  const notificacionesRecientes = notificaciones.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">{cards.notificaciones.title}</h3>
          {notificacionesNoLeidas.length > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">{notificacionesNoLeidas.length}</span>
          )}
        </div>
        <div className="p-2 bg-sky-50 rounded-xl">
          <Bell className="w-6 h-6 text-[#0ea5e9]" />
        </div>
      </div>
      {notificacionesRecientes.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{cards.notificaciones.emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {notificacionesRecientes.map((notificacion, index) => (
              <motion.div
                key={notificacion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-xl border ${getNotificationBg(notificacion.tipo)} ${!notificacion.leida ? 'ring-2 ring-[#0ea5e9]/30' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notificacion.tipo)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800">{notificacion.titulo}</p>
                    <p className="text-xs text-gray-600 mt-1">{notificacion.mensaje}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(notificacion.fecha).toLocaleDateString('es-AR')}</p>
                  </div>
                  {!notificacion.leida && (
                    <Button variant="ghost" size="sm" onClick={() => marcarNotificacionLeida(notificacion.id)} className="flex-shrink-0 h-8 w-8 p-0">
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
