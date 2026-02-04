import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

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
  const [searchQuery, setSearchQuery] = useState("");

  const groups = groupBy
    ? Array.from(new Set(items.map((item) => String(item[groupBy]))))
    : null;

  const baseItems = selectedGroup
    ? items.filter((item) => String(item[groupBy as keyof T]) === selectedGroup)
    : items;

  const searchLower = searchQuery.trim().toLowerCase();
  const filteredGroups = searchLower
    ? (groups ?? []).filter(
        (g) =>
          g.toLowerCase().includes(searchLower) ||
          items.some(
            (item) =>
              String(item[groupBy as keyof T]) === g &&
              renderItem(item).toLowerCase().includes(searchLower)
          )
      )
    : groups;
  const filteredItems = searchLower
    ? baseItems.filter((item) =>
        renderItem(item).toLowerCase().includes(searchLower)
      )
    : baseItems;

  const handleSelect = (item: T) => {
    onSelect(item);
    setIsOpen(false);
    setSelectedGroup(null);
    setSearchQuery("");
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setIsOpen(false);
    setSelectedGroup(null);
    setSearchQuery("");
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
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onPress={handleClose}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            style={{ width: "100%", maxHeight: "70%" }}
          >
            <View className="bg-background rounded-t-3xl pb-16 overflow-hidden">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-border">
              <Text className="text-xl font-bold text-foreground">{title}</Text>
              <Pressable onPress={handleClose}>
                <IconSymbol name="xmark.circle.fill" size={28} color={colors.muted} />
              </Pressable>
            </View>

            {/* Buscador */}
            <View
              className="flex-row items-center gap-2 px-4 py-3 border-b border-border bg-surface/50"
              style={{ minHeight: 48 }}
            >
              <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={`Buscar ${title.toLowerCase()}...`}
                placeholderTextColor={colors.muted}
                returnKeyType="search"
                className="flex-1 text-base py-2"
                style={{
                  color: colors.foreground,
                  fontSize: 16,
                  paddingVertical: 8,
                }}
              />
            </View>

            {/* Groups */}
            {groups && !selectedGroup && (
              <FlatList
                style={{ flexGrow: 0, maxHeight: 320 }}
                data={filteredGroups ?? []}
                keyExtractor={(group) => group}
                contentContainerStyle={{ paddingBottom: 32 }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                ListEmptyComponent={
                  <Text className="p-4 text-center text-muted">
                    Sin resultados
                  </Text>
                }
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
                    onPress={() => {
                      setSelectedGroup(null);
                      setSearchQuery("");
                    }}
                    className="flex-row items-center p-4 border-b border-border"
                  >
                    <IconSymbol name="chevron.left" size={20} color={colors.primary} />
                    <Text className="ml-2 text-lg text-primary">Volver</Text>
                  </TouchableOpacity>
                )}
                <FlatList
                  style={{ flexGrow: 0, maxHeight: 320 }}
                  data={filteredItems}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{ paddingBottom: 32 }}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  ListEmptyComponent={
                    <Text className="p-4 text-center text-muted">
                      Sin resultados
                    </Text>
                  }
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
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
