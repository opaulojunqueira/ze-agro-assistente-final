import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

const PersonalData: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout } = useAuth();
  const { profile, loading, updateProfile } = useUserProfile();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    phone: ''
  });

  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60");

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || currentUser?.email || '',
        birthDate: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        phone: profile.phone || ''
      });
    } else if (currentUser) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || ''
      }));
    }
  }, [profile, currentUser]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
        dateOfBirth: formData.birthDate,
        phone: formData.phone
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-zeagro-green to-zeagro-green/90 text-white p-4 shadow-lg mb-6 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-12 animate-pulse"></div>
          </div>
        </div>

        {/* Card Skeleton */}
        <div className="bg-white rounded-xl shadow-xl p-4 space-y-6">
          {/* Profile Photo Skeleton */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Save Button Skeleton */}
          <div className="w-full h-12 bg-gray-300 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-zeagro-green to-zeagro-green/90 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Dados Pessoais</h1>
          </div>
          
          <button 
            onClick={handleLogout}
            className="text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="p-4">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-zeagro-green">
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                </Avatar>
                <label htmlFor="photo-upload" className="absolute -bottom-2 -right-2 bg-zeagro-green text-white p-2 rounded-full cursor-pointer hover:bg-zeagro-green/90 transition-colors shadow-md">
                  <Camera size={16} />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-600">Toque no ícone da câmera para alterar sua foto</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="mt-1 bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(XX) XXXXX-XXXX"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSave}
              className="w-full bg-zeagro-green hover:bg-zeagro-green/90 text-white font-medium py-3 rounded-xl shadow-md"
            >
              <Save size={18} className="mr-2" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalData;
