
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Property, CreatePropertyData, UpdatePropertyData } from '../services/api';
import { useToast } from './use-toast';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const fetchProperties = async () => {
    if (!currentUser) {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userProperties = await apiService.getProperties();
      setProperties(userProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as propriedades",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (data: CreatePropertyData) => {
    try {
      const newProperty = await apiService.addProperty(data);
      setProperties(prev => [...prev, newProperty]);
      toast({
        title: "Sucesso!",
        description: "Propriedade adicionada com sucesso",
      });
      return newProperty;
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a propriedade",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProperty = async (propertyId: string, data: UpdatePropertyData) => {
    try {
      const updatedProperty = await apiService.updateProperty(propertyId, data);
      setProperties(prev => 
        prev.map(prop => prop._id === propertyId ? updatedProperty : prop)
      );
      toast({
        title: "Sucesso!",
        description: "Propriedade atualizada com sucesso",
      });
      return updatedProperty;
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a propriedade",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      await apiService.deleteProperty(propertyId);
      setProperties(prev => prev.filter(prop => prop._id !== propertyId));
      toast({
        title: "Sucesso!",
        description: "Propriedade removida com sucesso",
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a propriedade",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [currentUser]);

  return {
    properties,
    loading,
    addProperty,
    updateProperty,
    deleteProperty,
    refetchProperties: fetchProperties
  };
};
