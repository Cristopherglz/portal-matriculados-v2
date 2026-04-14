import { motion } from 'framer-motion';
import { ExternalLink, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/context/ContentContext';

export function TarifarioCard() {
  const { dashboardContent } = useContent();
  const { cards } = dashboardContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-gradient-to-br from-sky-50 to-white rounded-3xl p-6 shadow-lg shadow-sky-100/50 border border-blue-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{cards.tarifario.title}</h3>
        <div className="p-2 bg-[#0ea5e9]/10 rounded-xl">
          <FileText className="w-6 h-6 text-[#0ea5e9]" />
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{cards.tarifario.description}</p>
      <a href="https://tarifario-cdgm-fb81aaf4.vercel.app/" target="_blank" rel="noopener noreferrer" className="block">
        <Button className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white group">
          <ExternalLink className="w-4 h-4 mr-2" />
          {cards.accesoDirecto.tarifarioText}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </a>
      <div className="mt-4 p-3 bg-sky-50 rounded-xl">
        <p className="text-[#0284c7] text-xs">💡 Actualizado periódicamente según el índice de inflación</p>
      </div>
    </motion.div>
  );
}
