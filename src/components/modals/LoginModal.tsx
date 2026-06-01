import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Shield, Eye, EyeOff, User, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { SecureBadge } from '@/components/ui-custom/SecureBadge';
import { toast } from 'sonner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = 'login' | 'recover-email' | 'recover-code' | 'recover-success';

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState('matriculado');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, solicitarRecuperacion, resetPasswordConCodigo } = useAuth();

  // Recovery state
  const [view, setView] = useState<View>('login');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const resetAll = () => {
    setEmail(''); setPassword(''); setError('');
    setRecoveryEmail(''); setRecoveryCode('');
    setNewPassword(''); setConfirmPassword('');
    setView('login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        onClose();
        resetAll();
      } else {
        setError('Credenciales incorrectas. Por favor intente nuevamente.');
      }
    } catch {
      setError('Error al iniciar sesión. Intente más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await solicitarRecuperacion(recoveryEmail);
      if (res.success) {
        toast.success('Código enviado', {
          description: `Te enviamos un código de 6 dígitos a ${recoveryEmail}. (Demo: ${res.codigo})`,
        });
        setView('recover-code');
      } else {
        setError('No encontramos una cuenta con ese correo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setIsLoading(true);
    try {
      const ok = await resetPasswordConCodigo(recoveryEmail, recoveryCode, newPassword);
      if (ok) {
        setView('recover-success');
      } else {
        setError('El código es inválido o expiró. Solicitá uno nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = (idPrefix: string, placeholder: string) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`email-${idPrefix}`} className="text-gray-700">Correo Electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input id={`email-${idPrefix}`} type="email" placeholder={placeholder} value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 border-blue-200 focus:border-[#0ea5e9]" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`password-${idPrefix}`} className="text-gray-700">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input id={`password-${idPrefix}`} type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 border-blue-200 focus:border-[#0ea5e9]" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</motion.div>
      )}
      <Button type="submit" className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white" disabled={isLoading}>
        {isLoading ? 'Ingresando...' : 'Ingresar'}
      </Button>
      <div className="text-center">
        <button
          type="button"
          onClick={() => { setError(''); setRecoveryEmail(email); setView('recover-email'); }}
          className="text-sm text-[#0ea5e9] hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </form>
  );

  const renderRecoverEmail = () => (
    <form onSubmit={handleSolicitarCodigo} className="space-y-4">
      <p className="text-sm text-gray-600">
        Ingresá tu correo electrónico y te enviaremos un código de 6 dígitos para restablecer tu contraseña.
      </p>
      <div className="space-y-2">
        <Label htmlFor="recovery-email" className="text-gray-700">Correo Electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input id="recovery-email" type="email" placeholder="tu@email.com" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} className="pl-10 border-blue-200 focus:border-[#0ea5e9]" required />
        </div>
      </div>
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}
      <Button type="submit" className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white" disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Enviar código'}
      </Button>
      <button type="button" onClick={() => { setError(''); setView('login'); }} className="w-full flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-[#0ea5e9]">
        <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
      </button>
    </form>
  );

  const renderRecoverCode = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <p className="text-sm text-gray-600">
        Ingresá el código que te enviamos a <span className="font-medium text-gray-800">{recoveryEmail}</span> y definí tu nueva contraseña.
      </p>
      <div className="space-y-2">
        <Label htmlFor="recovery-code" className="text-gray-700">Código de verificación</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input id="recovery-code" type="text" inputMode="numeric" maxLength={6} placeholder="123456" value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, ''))} className="pl-10 tracking-widest border-blue-200 focus:border-[#0ea5e9]" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-gray-700">Nueva contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input id="new-password" type={showNewPassword ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-10 pr-10 border-blue-200 focus:border-[#0ea5e9]" required />
          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-gray-700">Confirmar contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input id="confirm-password" type={showNewPassword ? 'text' : 'password'} placeholder="Repetí la contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 border-blue-200 focus:border-[#0ea5e9]" required />
        </div>
      </div>
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}
      <Button type="submit" className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white" disabled={isLoading}>
        {isLoading ? 'Procesando...' : 'Restablecer contraseña'}
      </Button>
      <button type="button" onClick={() => { setError(''); setView('recover-email'); }} className="w-full flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-[#0ea5e9]">
        <ArrowLeft className="w-4 h-4" /> Usar otro correo
      </button>
    </form>
  );

  const renderRecoverSuccess = () => (
    <div className="space-y-4 text-center py-4">
      <div className="flex justify-center">
        <div className="p-3 bg-green-100 rounded-full">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">¡Contraseña actualizada!</h3>
      <p className="text-sm text-gray-600">
        Ya podés iniciar sesión con tu nueva contraseña.
      </p>
      <Button onClick={() => { setError(''); setPassword(''); setView('login'); }} className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white">
        Ir al inicio de sesión
      </Button>
    </div>
  );

  const headerTitle = view === 'login' ? 'Acceso al Sistema' : 'Recuperar Contraseña';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={handleClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden border border-blue-100">
              <div className="relative bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] p-6">
                <button onClick={handleClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-xl">
                    {view === 'login' ? <Shield className="w-6 h-6 text-white" /> : <KeyRound className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{headerTitle}</h2>
                    <p className="text-blue-100 text-sm">Colegio de Diseñadores Gráficos</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {view === 'login' && (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-sky-50">
                      <TabsTrigger value="matriculado" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white">
                        <User className="w-4 h-4 mr-2" />Matriculado
                      </TabsTrigger>
                      <TabsTrigger value="administrador" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white">
                        <Shield className="w-4 h-4 mr-2" />Administrador
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="matriculado" className="mt-0">
                      {renderForm('mat', 'tu@email.com')}
                    </TabsContent>
                    <TabsContent value="administrador" className="mt-0">
                      {renderForm('admin', 'admin@colegiodg.com')}
                    </TabsContent>
                  </Tabs>
                )}
                {view === 'recover-email' && renderRecoverEmail()}
                {view === 'recover-code' && renderRecoverCode()}
                {view === 'recover-success' && renderRecoverSuccess()}

                <div className="mt-6 flex justify-center">
                  <SecureBadge variant="compact" />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
