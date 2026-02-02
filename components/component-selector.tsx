import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, Pressable } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface ComponentSelectorProps<T> {
  title: string;
  items: T[];
  selectedItem: T | null;
  onSelect: (item: T) => void;
  renderItem: (item: T) => string;
  groupBy?: keyof T;
}

export function ComponentSelector<T extends { id: number }>({
  title,
  items,
  selectedItem,
  onSelect,
  renderItem,
  groupBy,
}: ComponentSelectorProps<T>) {
  const colors = useColors();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const groups = groupBy
    ? Array.from(new Set(items.map((item) => String(item[groupBy]))))
    : null;

  const filteredItems = selectedGroup
    ? items.filter((item) => String(item[groupBy as keyof T]) === selectedGroup)
    : items;

  const handleSelect = (item: T) => {
    onSelect(item);
    setIsOpen(false);
    setSelectedGroup(null);
  };

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border">
      <Text className="text-lg font-semibold text-foreground mb-3">{title}</Text>
      
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="flex-row items-center justify-between bg-background rounded-xl p-4 border border-border"
      >
        <Text className={`flex-1 ${selectedItem ? "text-foreground" : "text-muted"}`}>
          {selectedItem ? renderItem(selectedItem) : `Seleccionar ${title.toLowerCase()}`}
        </Text>
        <IconSymbol name="chevron.down" size={20} color={colors.muted} />
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl max-h-[60%] pb-6">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-border">
              <Text className="text-xl font-bold text-foreground">{title}</Text>
              <Pressable onPress={() => { setIsOpen(false); setSelectedGroup(null); }}>
                <IconSymbol name="xmark.circle.fill" size={28} color={colors.muted} />
              </Pressable>
            </View>

            {/* Groups */}
            {groups && !selectedGroup && (
              <FlatList
                data={groups}
                keyExtractor={(group) => group}
                renderItem={({ item: group }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedGroup(group)}
                    className="flex-row items-center justify-between p-4 border-b border-border"
                  >
                    <Text className="text-lg text-foreground">{group}</Text>
                    <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                  </TouchableOpacity>
                )}
              />
            )}

            {/* Items */}
            {(!groups || selectedGroup) && (
              <>
                {selectedGroup && (
                  <TouchableOpacity
                    onPress={() => setSelectedGroup(null)}
                    className="flex-row items-center p-4 border-b border-border"
                  >
                    <IconSymbol name="chevron.left" size={20} color={colors.primary} />
                    <Text className="ml-2 text-lg text-primary">Volver</Text>
                  </TouchableOpacity>
                )}
                <FlatList
                  data={filteredItems}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelect(item)}
                      className="p-4 border-b border-border"
                    >
                      <Text className="text-base text-foreground">{renderItem(item)}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
