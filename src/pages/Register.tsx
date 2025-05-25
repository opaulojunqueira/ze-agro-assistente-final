import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ZeLogo from '../components/ZeLogo';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Por favor preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      // Primeiro, registra no Firebase
      await register(email, password);
      
      // Depois, cria o perfil do usuário na API
      await apiService.createOrUpdateProfile({
        name: name
      });
      
      toast({
        title: "Sucesso!",
        description: "Conta criada com sucesso",
      });
      navigate('/home');
    } catch (error: any) {
      console.error('Register error:', error);
      let errorMessage = "Erro ao criar conta";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este email já está em uso";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "A senha é muito fraca";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido";
      }
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="py-4">
        <div className="flex justify-center">
          <ZeLogo />
        </div>
      </div>
      
      <form onSubmit={handleRegister} className="flex flex-col gap-4 mt-6">
        {/* Name input */}
        <div className="input-field">
          <User size={20} className="text-zeagro-gray-dark" />
          <input 
            type="text" 
            placeholder="Nome completo" 
            className="flex-1 bg-transparent outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        
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
        
        {/* Confirm Password input */}
        <div className="input-field">
          <Lock size={20} className="text-zeagro-gray-dark" />
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Confirme sua senha" 
            className="flex-1 bg-transparent outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        
        {/* Register button */}
        <button 
          type="submit" 
          className="btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        
        {/* Login link */}
        <div className="text-center mt-6">
          <p className="text-zeagro-gray-dark">
            Já tem conta? {" "}
            <Link to="/login" className="text-zeagro-green font-medium hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
