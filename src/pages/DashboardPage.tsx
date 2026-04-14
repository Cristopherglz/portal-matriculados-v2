import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { WelcomeCard } from '@/components/cards/WelcomeCard';
import { StatusCard } from '@/components/cards/StatusCard';
import { PaymentCard } from '@/components/cards/PaymentCard';
import { TarifarioCard } from '@/components/cards/TarifarioCard';
import { NotificationsCard } from '@/components/cards/NotificationsCard';
import { QuickAccessCard } from '@/components/cards/QuickAccessCard';
import { DatosPersonalesForm } from '@/components/forms/DatosPersonalesForm';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { SecureBadge } from '@/components/ui-custom/SecureBadge';
import { LogoutConfirmModal } from '@/components/modals/LogoutConfirmModal';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  if (!user) return null;

  const isAdmin = user.tipo === 'administrador';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F5FF] to-white">
      <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8 }} className="bg-white/80 backdrop-blur-xl shadow-lg shadow-sky-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500 rounded-xl"><Shield className="w-5 h-5 text-white" /></div>
            <span className="font-semibold text-emerald-700 text-sm">Seguro</span>
          </div>
          <Button onClick={() => setIsLogoutModalOpen(true)} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />Cerrar Sesión
          </Button>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <WelcomeCard user={user} />
              <StatusCard user={user} />
              <PaymentCard user={user} />
              <TarifarioCard />
              <NotificationsCard notificaciones={user.notificaciones} />
              <QuickAccessCard />
            </div>
            <div id="datos-personales"><DatosPersonalesForm /></div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex justify-center">
              <SecureBadge variant="banner" />
            </motion.div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <img src={cdgmFootLogo} alt="CDGM Logo" className="h-12" />
          </div>
          <p className="text-gray-500 text-sm">© 2026 Colegio de Diseñadores Gráficos de Misiones. Todos los derechos reservados.</p>
        </div>
      </footer>

      <LogoutConfirmModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={() => { logout(); setIsLogoutModalOpen(false); navigate('/'); }} />
    </div>
  );
}
