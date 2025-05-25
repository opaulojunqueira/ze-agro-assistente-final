
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, UserProfile, UpdateProfileData } from '../services/api';
import { useToast } from './use-toast';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!currentUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userProfile = await apiService.getUserProfile();
      setProfile(userProfile);
    } catch (error) {
      // If profile doesn't exist, try to create it
      try {
        const newProfile = await apiService.createOrUpdateProfile({
          name: currentUser.displayName || '',
          email: currentUser.email || '',
        });
        setProfile(newProfile);
      } catch (createError) {
        console.error('Error creating user profile:', createError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o perfil do usuário",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const updatedProfile = await apiService.updateProfile(data);
      setProfile(updatedProfile);
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso",
      });
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  return {
    profile,
    loading,
    updateProfile,
    refetchProfile: fetchProfile
  };
};
