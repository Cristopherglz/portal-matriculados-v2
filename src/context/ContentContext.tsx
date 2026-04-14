import React, { createContext, useContext, useState, useEffect } from 'react';

export interface HomeContent {
  hero: {
    badge: string;
    title: string;
    highlightText: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  previewCards: {
    matricula: { title: string; subtitle: string };
    profesionales: { title: string; subtitle: string };
    tarifario: { title: string; subtitle: string };
  };
  footer: {
    description: string;
    email: string;
    direccion: string;
  };
}

export interface DashboardContent {
  welcome: { title: string; subtitle: string };
  cards: {
    estadoMatricula: { title: string; alDia: string; deuda: string };
    proximoVencimiento: { title: string };
    notificaciones: { title: string; emptyMessage: string };
    accesoDirecto: { title: string; directorioText: string; tarifarioText: string };
    tarifario: { title: string; description: string };
  };
}

interface ContentContextType {
  homeContent: HomeContent;
  dashboardContent: DashboardContent;
  updateHomeContent: (content: Partial<HomeContent>) => void;
  updateDashboardContent: (content: Partial<DashboardContent>) => void;
  updateHomeHero: (hero: Partial<HomeContent['hero']>) => void;
  updateHomePreviewCards: (cards: Partial<HomeContent['previewCards']>) => void;
  updateHomeFooter: (footer: Partial<HomeContent['footer']>) => void;
  updateDashboardWelcome: (welcome: Partial<DashboardContent['welcome']>) => void;
  updateDashboardCards: (cards: Partial<DashboardContent['cards']>) => void;
}

const defaultHomeContent: HomeContent = {
  hero: {
    badge: 'Sistema de Matrículas Profesionales',
    title: 'Colegio de ',
    highlightText: 'Diseñadores Gráficos',
    subtitle: ' de Misiones',
    description: 'Sistema integral de gestión de matrículas profesionales. Accedé a tu información, mantené tus pagos al día y formá parte de nuestra comunidad.',
    primaryButtonText: 'Acceder al sistema',
    secondaryButtonText: 'Ver Directorio',
  },
  previewCards: {
    matricula: { title: '​Sistema de Matrículas Profesionales ', subtitle: 'Colegio de Diseñadores Gráficos de Misiones' },
    profesionales: { title: 'Profesionales', subtitle: '500+ matriculados' },
    tarifario: { title: 'Acceso al Tarifario para Profesionales', subtitle: 'Valores actualizados' },
  },
  footer: {
    description: 'Representando y regulando la actividad del diseño gráfico en la provincia de Misiones.',
    email: 'contacto@colegiodgmisiones.org',
    direccion: 'Posadas, Misiones, Argentina',
  },
};

const defaultDashboardContent: DashboardContent = {
  welcome: { title: '¡Bienvenido!', subtitle: 'Este es tu panel de control personalizado.' },
  cards: {
    estadoMatricula: { title: 'Estado de Matrícula', alDia: 'Al día', deuda: 'En deuda' },
    proximoVencimiento: { title: 'Próximo Vencimiento' },
    notificaciones: { title: 'Notificaciones', emptyMessage: 'No tenés notificaciones pendientes' },
    accesoDirecto: { title: 'Acceso Directo', directorioText: 'Ver Directorio', tarifarioText: 'Ver Tarifario' },
    tarifario: { title: 'Tarifario de Referencia', description: 'Valores orientativos para servicios de diseño gráfico profesional.' },
  },
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [homeContent, setHomeContent] = useState<HomeContent>(() => {
    try {
      const stored = localStorage.getItem('cdg_home_content');
      return stored ? JSON.parse(stored) : defaultHomeContent;
    } catch {
      return defaultHomeContent;
    }
  });

  const [dashboardContent, setDashboardContent] = useState<DashboardContent>(() => {
    try {
      const stored = localStorage.getItem('cdg_dashboard_content');
      return stored ? JSON.parse(stored) : defaultDashboardContent;
    } catch {
      return defaultDashboardContent;
    }
  });

  useEffect(() => {
    localStorage.setItem('cdg_home_content', JSON.stringify(homeContent));
  }, [homeContent]);

  useEffect(() => {
    localStorage.setItem('cdg_dashboard_content', JSON.stringify(dashboardContent));
  }, [dashboardContent]);

  const updateHomeContent = (content: Partial<HomeContent>) => setHomeContent(prev => ({ ...prev, ...content }));
  const updateDashboardContent = (content: Partial<DashboardContent>) => setDashboardContent(prev => ({ ...prev, ...content }));
  const updateHomeHero = (hero: Partial<HomeContent['hero']>) => setHomeContent(prev => ({ ...prev, hero: { ...prev.hero, ...hero } }));
  const updateHomePreviewCards = (cards: Partial<HomeContent['previewCards']>) => setHomeContent(prev => ({ ...prev, previewCards: { ...prev.previewCards, ...cards } }));
  const updateHomeFooter = (footer: Partial<HomeContent['footer']>) => setHomeContent(prev => ({ ...prev, footer: { ...prev.footer, ...footer } }));
  const updateDashboardWelcome = (welcome: Partial<DashboardContent['welcome']>) => setDashboardContent(prev => ({ ...prev, welcome: { ...prev.welcome, ...welcome } }));
  const updateDashboardCards = (cards: Partial<DashboardContent['cards']>) => setDashboardContent(prev => ({ ...prev, cards: { ...prev.cards, ...cards } }));

  return (
    <ContentContext.Provider value={{
      homeContent, dashboardContent, updateHomeContent, updateDashboardContent,
      updateHomeHero, updateHomePreviewCards, updateHomeFooter,
      updateDashboardWelcome, updateDashboardCards,
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
