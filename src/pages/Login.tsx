
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ZeLogo from '../components/ZeLogo';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password);
      navigate('/home');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="py-8">
        <div className="flex justify-center">
          <ZeLogo />
        </div>
      </div>
      
      <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-8">
        {/* Email input */}
        <div className="input-field">
          <Mail size={20} className="text-zeagro-gray-dark" />
          <input 
            type="email" 
            placeholder="Email" 
            className="flex-1 bg-transparent outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        
        {/* Password input */}
        <div className="input-field">
          <Lock size={20} className="text-zeagro-gray-dark" />
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Senha" 
            className="flex-1 bg-transparent outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="text-zeagro-gray-dark"
            disabled={loading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        {/* Login button */}
        <button 
          type="submit" 
          className="btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        
        {/* Forgot password */}
        <div className="text-center mt-2">
          <Link to="/forgot-password" className="text-sm text-zeagro-gray-dark hover:underline">
            Esqueceu a senha?
          </Link>
        </div>
        
        {/* Register link */}
        <div className="text-center mt-6">
          <p className="text-zeagro-gray-dark">
            Não tem conta? {" "}
            <Link to="/register" className="text-zeagro-green font-medium hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
