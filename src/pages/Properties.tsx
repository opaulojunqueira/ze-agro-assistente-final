import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Plus, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiService, Property } from '@/services/api';
import { useSwipeable } from 'react-swipeable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PropertyItemProps {
  property: Property;
  onDelete: (id: string) => void;
}

const PropertyItem: React.FC<PropertyItemProps> = ({ property, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowDeleteDialog(true),
    trackMouse: true
  });

  return (
    <>
      <div {...handlers}>
        <Card className="shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-zeagro-green mb-2">{property.propertyName}</h3>
                
                <div className="space-y-1 text-sm text-gray-600">
                  {property.geolocation && (
                    <p className="text-xs">
                      Coordenadas: {property.geolocation.coordinates[1].toFixed(4)}, {property.geolocation.coordinates[0].toFixed(4)}
                    </p>
                  )}
                  <p>Área: {property.sizeHa} hectares</p>
                  {property.propertyType && <p>Tipo: {property.propertyType}</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Propriedade</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a propriedade "{property.propertyName}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(property._id);
                setShowDeleteDialog(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const Properties: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newProperty, setNewProperty] = useState({
    propertyName: '',
    sizeHa: '',
    propertyType: 'Fazenda'
  });

  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Carregar propriedades ao iniciar
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getProperties();
      setProperties(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas propriedades"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const propertyData = {
              propertyName: newProperty.propertyName,
              sizeHa: Number(newProperty.sizeHa),
              propertyType: newProperty.propertyType,
              geolocation: {
                type: 'Point' as const,
                coordinates: [longitude, latitude]
              }
            };
            
            await apiService.addProperty(propertyData);
            await loadProperties(); // Recarrega a lista
            setNewProperty({ propertyName: '', sizeHa: '', propertyType: 'Fazenda' });
            setIsAddingProperty(false);
            
            toast({
              title: "Propriedade adicionada!",
              description: "Sua propriedade foi cadastrada com sucesso"
            });
          } catch (error) {
            toast({
              title: "Erro",
              description: "Não foi possível adicionar a propriedade"
            });
          }
          
          setIsGettingLocation(false);
        },
        (error) => {
          setIsGettingLocation(false);
          toast({
            title: "Erro de localização",
            description: "Não foi possível acessar sua localização. Verifique as permissões."
          });
        }
      );
    } else {
      setIsGettingLocation(false);
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização"
      });
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await apiService.deleteProperty(id);
      await loadProperties(); // Recarrega a lista
      toast({
        title: "Propriedade removida",
        description: "A propriedade foi removida com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a propriedade"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-zeagro-green to-zeagro-green/90 text-white p-4 shadow-lg mb-6 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
            </div>
            <div className="w-11 h-11 rounded-full bg-gray-300 animate-pulse"></div>
          </div>
        </div>

        {/* Properties List Skeleton */}
        <div className="space-y-4">
           {[...Array(3)].map((_, i) => (
             <Card key={i} className="shadow-xl animate-pulse">
               <CardContent className="p-4">
                 <div className="flex items-start justify-between">
                   <div className="flex-1">
                     <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                     <div className="space-y-1 text-sm">
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>
           ))}
        </div>

        {/* Bottom Navigation Placeholder */}
         <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-300 animate-pulse"></div>

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
            <h1 className="text-xl font-bold">Minhas Propriedades</h1>
          </div>
          
          <button 
            onClick={() => setIsAddingProperty(true)}
            className="bg-white/10 backdrop-blur-sm rounded-full w-11 h-11 flex items-center justify-center hover:bg-white/20 transition-all duration-200 shadow-md"
          >
            <Plus size={22} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Add Property Form */}
        {isAddingProperty && (
          <Card className="shadow-xl border-zeagro-green/20">
            <CardHeader>
              <CardTitle className="text-zeagro-green">Nova Propriedade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="propertyName">Nome da Propriedade</Label>
                <Input
                  id="propertyName"
                  value={newProperty.propertyName}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, propertyName: e.target.value }))}
                  placeholder="Ex: Fazenda São João"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="sizeHa">Área (hectares)</Label>
                <Input
                  id="sizeHa"
                  value={newProperty.sizeHa}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, sizeHa: e.target.value }))}
                  placeholder="Ex: 12"
                  type="number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="propertyType">Tipo de Propriedade</Label>
                <Input
                  id="propertyType"
                  value={newProperty.propertyType}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, propertyType: e.target.value }))}
                  placeholder="Ex: Fazenda"
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation || !newProperty.propertyName || !newProperty.sizeHa}
                  className="flex-1 bg-zeagro-green hover:bg-zeagro-green/90 text-white"
                >
                  <MapPin size={18} className="mr-2" />
                  {isGettingLocation ? 'Obtendo localização...' : 'Usar Localização Atual'}
                </Button>
                
                <Button 
                  onClick={() => setIsAddingProperty(false)}
                  variant="outline"
                  className="px-6"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zeagro-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando propriedades...</p>
          </div>
        )}

        {/* Properties List */}
        {!isLoading && properties.map((property) => (
          <PropertyItem
            key={property._id}
            property={property}
            onDelete={deleteProperty}
          />
        ))}

        {!isLoading && properties.length === 0 && !isAddingProperty && (
          <div className="text-center py-12">
            <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhuma propriedade cadastrada
            </h3>
            <p className="text-gray-500 mb-6">
              Adicione suas propriedades para melhor gestão
            </p>
            <Button 
              onClick={() => setIsAddingProperty(true)}
              className="bg-zeagro-green text-white px-6 py-3 rounded-xl font-medium hover:bg-zeagro-green/90 transition-colors shadow-md"
            >
              <Plus size={18} className="mr-2" />
              Adicionar Propriedade
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
