import { motion } from 'framer-motion';
import { Users, Settings, FileText, HelpCircle, ChevronRight } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

const accessItems = [
  { icon: Users, label: 'Directorio de Profesionales', description: 'Ver colegas matriculados', href: '/directorio', color: 'bg-sky-50 text-[#0284c7]' },
  { icon: FileText, label: 'Tarifario', description: 'Consultar tarifas de referencia', href: 'https://tarifario-cdgm-fb81aaf4.vercel.app/', external: true, color: 'bg-emerald-50 text-emerald-600' },
  { icon: HelpCircle, label: 'Ayuda y Soporte', description: 'Preguntas frecuentes', href: '#', color: 'bg-amber-50 text-amber-600' },
  { icon: Settings, label: 'Configuración', description: 'Gestionar tu cuenta', href: '#datos-personales', color: 'bg-purple-50 text-purple-600' },
];

export function QuickAccessCard() {
  const { dashboardContent } = useContent();
  const { cards } = dashboardContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{cards.accesoDirecto.title}</h3>
      </div>
      <div className="space-y-2">
        {accessItems.map((item, index) => (
          <motion.a
            key={item.label}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ x: 5, backgroundColor: '#F8FAFC' }}
            className="flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer group"
          >
            <div className={`p-2 rounded-lg ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0ea5e9] transition-colors" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
