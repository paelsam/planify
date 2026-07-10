import { useState } from 'react';
import { useNavigate } from 'react-router';
import { saveUser, initializeSampleData } from '../utils/storage';
import { toast } from 'sonner';
import { Github } from 'lucide-react';

// Google Icon Component
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // Simulate Google OAuth
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: 'Estudiante Demo',
        email: 'estudiante@demo.com',
        photoURL: 'https://ui-avatars.com/api/?name=Estudiante+Demo&background=FFD93D&color=000',
      };
      
      saveUser(mockUser);
      initializeSampleData();
      toast.success(`Hola, ${mockUser.name}. Tu semana te espera.`);
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4">
      <div 
        className="bg-white border-4 border-black p-4 sm:p-6 md:p-8 max-w-md w-full"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
      >
        <div className="text-center mb-6 md:mb-8">
          <div 
            className="inline-block bg-black border-4 border-black p-4 sm:p-6 mb-4 sm:mb-6"
            style={{ boxShadow: '4px 4px 0px 0px #000000' }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white">PLANIFY</h1>
          </div>
          <p className="text-base sm:text-lg font-bold px-2">
            Planifica tu semana académica y alcanza tus metas
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-black text-white border-4 border-black p-3 sm:p-4 font-black text-base sm:text-lg uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
          style={{ boxShadow: '4px 4px 0px 0px #000000' }}
        >
          {isLoading ? 'Conectando con Google…' : (
            <>
              <GoogleIcon size={24} />
              <span>Continuar con Google</span>
            </>
          )}
        </button>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#E5E5E5] border-4 border-black">
          <p className="text-xs font-bold text-center">
            Modo demo: entras con datos de ejemplo. Puedes borrarlos cuando quieras.
          </p>
        </div>
      </div>

      <footer className="mt-8">
        <a
          href="https://github.com/paelsam"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white border-4 border-black px-6 py-3 font-black uppercase hover:bg-gray-100 transition-colors"
          style={{ boxShadow: '4px 4px 0px 0px #000000' }}
        >
          <Github size={24} strokeWidth={3} />
          <span>@paelsam</span>
        </a>
      </footer>
    </div>
  );
}