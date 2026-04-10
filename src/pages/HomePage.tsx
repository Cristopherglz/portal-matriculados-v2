import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FileText, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/modals/LoginModal';
import cdgmLogo from '@/assets/cdgm-logo.png';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { homeContent } = useContent();
  const { hero, previewCards, footer } = homeContent;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F5FF] to-white">
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-sky-100/50 mx-4 mt-4 rounded-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={cdgmLogo} alt="CDGM Logo" className="h-10" />
            </div>
            <Button onClick={() => setIsLoginOpen(true)} className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white">Acceder</Button>
          </div>
        </div>
      </motion.nav>

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E7EEF9] via-white to-[#F0F5FF] -z-10" />
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-20 right-10 w-96 h-96 bg-[#0ea5e9]/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0ea5e9]/10 rounded-full mb-6">
                <CheckCircle className="w-4 h-4 text-[#0ea5e9]" />
                <span className="text-sm font-medium text-[#0ea5e9]">{hero.badge}</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                {hero.title}<span className="text-[#0ea5e9]">{hero.highlightText}</span>{hero.subtitle}
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-lg text-gray-600 mb-8 max-w-lg">{hero.description}</motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-wrap gap-4">
                <Button onClick={() => setIsLoginOpen(true)} size="lg" className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-8">{hero.primaryButtonText}<ArrowRight className="w-5 h-5 ml-2" /></Button>
                <a href="/directorio"><Button variant="outline" size="lg" className="border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-white"><Users className="w-5 h-5 mr-2" />{hero.secondaryButtonText}</Button></a>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: 0.4 }} className="relative">
              <div className="relative bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] rounded-3xl p-8 shadow-2xl shadow-[#0ea5e9]/30">
                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">Sistema Seguro</div>
                <div className="space-y-4">
                  {([
                    { icon: Shield, ...previewCards.matricula, check: true as const },
                    { icon: Users, ...previewCards.profesionales, check: false as const },
                    { icon: FileText, ...previewCards.tarifario, check: false as const },
                  ] as const).map((card, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><card.icon className="w-6 h-6 text-white" /></div>
                        <div><p className="text-white font-medium">{card.title}</p><p className="text-blue-200 text-sm">{card.subtitle}</p></div>
                        {card.check && <CheckCircle className="w-6 h-6 text-emerald-400 ml-auto" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="text-white py-12 px-6 bg-primary-foreground">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={cdgmLogo} alt="CDGM Logo" className="h-12" />
            </div>
            <p className="text-sm text-secondary-foreground">{footer.description}</p>
          </div>
          <div><h4 className="font-semibold mb-4 text-secondary-foreground">Contacto</h4><p className="text-sm text-secondary-foreground">{footer.email}</p><p className="text-sm mt-1 text-secondary-foreground">{footer.direccion}</p></div>
          <div className="text-secondary-foreground"><p className="text-sm text-secondary-foreground">© 2026 Colegio de Diseñadores Gráficos de Misiones. Todos los derechos reservados.</p></div>
        </div>
      </footer>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
