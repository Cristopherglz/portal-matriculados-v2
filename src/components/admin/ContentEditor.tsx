import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Type, CreditCard, Home, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useContent } from '@/context/ContentContext';
import { toast } from 'sonner';

export function ContentEditor() {
  const { homeContent, dashboardContent, updateHomeHero, updateHomePreviewCards, updateHomeFooter, updateDashboardWelcome, updateDashboardCards } = useContent();

  const [hero, setHero] = useState(homeContent.hero);
  const [previewCards, setPreviewCards] = useState(homeContent.previewCards);
  const [footer, setFooter] = useState(homeContent.footer);
  const [welcome, setWelcome] = useState(dashboardContent.welcome);
  const [cards, setCards] = useState(dashboardContent.cards);

  const handleSaveHome = () => {
    updateHomeHero(hero);
    updateHomePreviewCards(previewCards);
    updateHomeFooter(footer);
    toast.success('Contenido de la página de inicio guardado exitosamente');
  };

  const handleSaveDashboard = () => {
    updateDashboardWelcome(welcome);
    updateDashboardCards(cards);
    toast.success('Contenido del dashboard guardado exitosamente');
  };

  const handleResetHome = () => {
    setHero(homeContent.hero);
    setPreviewCards(homeContent.previewCards);
    setFooter(homeContent.footer);
    toast.info('Cambios descartados');
  };

  const handleResetDashboard = () => {
    setWelcome(dashboardContent.welcome);
    setCards(dashboardContent.cards);
    toast.info('Cambios descartados');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-sky-50">
          <TabsTrigger value="home" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white"><Home className="w-4 h-4 mr-2" />Página de Inicio</TabsTrigger>
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white"><LayoutDashboard className="w-4 h-4 mr-2" />Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
            <div className="flex items-center gap-2 mb-6"><Type className="w-5 h-5 text-[#0ea5e9]" /><h3 className="text-lg font-semibold">Sección Hero</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label>Badge</Label><Input value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} /></div>
              <div className="space-y-2"><Label>Título (Parte 1)</Label><Input value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Texto Resaltado</Label><Input value={hero.highlightText} onChange={(e) => setHero({ ...hero, highlightText: e.target.value })} className="border-[#0ea5e9]" /></div>
              <div className="space-y-2"><Label>Título (Parte 2)</Label><Input value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Descripción</Label><Textarea value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} rows={3} /></div>
              <div className="space-y-2"><Label>Botón Principal</Label><Input value={hero.primaryButtonText} onChange={(e) => setHero({ ...hero, primaryButtonText: e.target.value })} /></div>
              <div className="space-y-2"><Label>Botón Secundario</Label><Input value={hero.secondaryButtonText} onChange={(e) => setHero({ ...hero, secondaryButtonText: e.target.value })} /></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
            <div className="flex items-center gap-2 mb-6"><CreditCard className="w-5 h-5 text-[#0ea5e9]" /><h3 className="text-lg font-semibold">Tarjetas de Vista Previa</h3></div>
            <div className="space-y-4">
              {(['matricula', 'profesionales', 'tarifario'] as const).map((key) => (
                <div key={key} className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-700 mb-4 capitalize">{key}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Título</Label><Input value={previewCards[key].title} onChange={(e) => setPreviewCards({ ...previewCards, [key]: { ...previewCards[key], title: e.target.value } })} /></div>
                    <div className="space-y-2"><Label>Subtítulo</Label><Input value={previewCards[key].subtitle} onChange={(e) => setPreviewCards({ ...previewCards, [key]: { ...previewCards[key], subtitle: e.target.value } })} /></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex gap-3">
            <Button onClick={handleSaveHome} className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white"><Save className="w-4 h-4 mr-2" />Guardar</Button>
            <Button onClick={handleResetHome} variant="outline"><RotateCcw className="w-4 h-4 mr-2" />Descartar</Button>
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Bienvenida</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Título</Label><Input value={welcome.title} onChange={(e) => setWelcome({ ...welcome, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Subtítulo</Label><Input value={welcome.subtitle} onChange={(e) => setWelcome({ ...welcome, subtitle: e.target.value })} /></div>
            </div>
          </motion.div>
          <div className="flex gap-3">
            <Button onClick={handleSaveDashboard} className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white"><Save className="w-4 h-4 mr-2" />Guardar</Button>
            <Button onClick={handleResetDashboard} variant="outline"><RotateCcw className="w-4 h-4 mr-2" />Descartar</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
