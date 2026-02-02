import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, Pressable, Alert } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { StorageItem } from "@/shared/types";

interface StorageManagerProps {
  storageTypes: Array<{ id: number; type: string; wattsPerUnit: number; description: string | null }>;
  storage: StorageItem[];
  onUpdate: (storage: StorageItem[]) => void;
}

export function StorageManager({ storageTypes, storage, onUpdate }: StorageManagerProps) {
  const colors = useColors();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (!selectedType) {
      Alert.alert("Error", "Selecciona un tipo de almacenamiento");
      return;
    }

    const type = storageTypes.find((t) => t.id === selectedType);
    if (!type) return;

    const newStorage: StorageItem = {
      typeId: type.id,
      type: type.type,
      quantity,
      wattsPerUnit: type.wattsPerUnit,
    };

    onUpdate([...storage, newStorage]);
    setIsModalOpen(false);
    setSelectedType(null);
    setQuantity(1);
  };

  const handleRemove = (index: number) => {
    const newStorage = storage.filter((_, i) => i !== index);
    onUpdate(newStorage);
  };

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border">
      <Text className="text-lg font-semibold text-foreground mb-3">Almacenamiento</Text>

      {/* Lista de almacenamiento agregado */}
      {storage.length > 0 && (
        <View className="gap-2 mb-3">
          {storage.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between bg-background rounded-xl p-3 border border-border"
            >
              <View className="flex-1">
                <Text className="text-base text-foreground font-medium">{item.type}</Text>
                <Text className="text-sm text-muted">
                  {item.quantity}x unidad{item.quantity > 1 ? "es" : ""} • {item.wattsPerUnit * item.quantity}W
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleRemove(index)}>
                <IconSymbol name="xmark.circle.fill" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Botón agregar */}
      <TouchableOpacity
        onPress={() => setIsModalOpen(true)}
        className="flex-row items-center justify-center gap-2 bg-primary py-3 rounded-xl"
      >
        <IconSymbol name="plus.circle.fill" size={20} color={colors.background} />
        <Text className="text-background font-semibold">Agregar Almacenamiento</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 max-h-[65%] pb-8">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-foreground">Agregar Almacenamiento</Text>
              <Pressable onPress={() => { setIsModalOpen(false); setSelectedType(null); setQuantity(1); }}>
                <IconSymbol name="xmark.circle.fill" size={28} color={colors.muted} />
              </Pressable>
            </View>

            {/* Tipo */}
            <Text className="text-sm text-muted mb-2">Tipo de almacenamiento</Text>
            <FlatList
              data={storageTypes}
              keyExtractor={(item) => item.id.toString()}
              className="mb-4 max-h-48"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedType(item.id)}
                  className={`p-4 rounded-xl mb-2 border ${
                    selectedType === item.id
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      selectedType === item.id ? "text-background" : "text-foreground"
                    }`}
                  >
                    {item.type}
                  </Text>
                  <Text
                    className={`text-sm ${
                      selectedType === item.id ? "text-background/80" : "text-muted"
                    }`}
                  >
                    {item.description} • {item.wattsPerUnit}W por unidad
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* Cantidad */}
            <Text className="text-sm text-muted mb-2">Cantidad</Text>
            <View className="flex-row items-center gap-3 mb-4">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 items-center justify-center bg-surface rounded-xl border border-border"
              >
                <Text className="text-2xl text-foreground">−</Text>
              </TouchableOpacity>
              <View className="flex-1 items-center">
                <Text className="text-3xl font-bold text-foreground">{quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                className="w-12 h-12 items-center justify-center bg-surface rounded-xl border border-border"
              >
                <Text className="text-2xl text-foreground">+</Text>
              </TouchableOpacity>
            </View>

            {/* Botón agregar */}
            <TouchableOpacity
              onPress={handleAdd}
              className="bg-primary py-4 rounded-xl"
            >
              <Text className="text-center text-background text-lg font-bold">Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
