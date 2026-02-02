# Diseño de Interfaz - Calculadora de PSU para PC

## Orientación y Contexto
- **Orientación**: Móvil vertical (9:16)
- **Uso**: Una mano
- **Estilo**: iOS nativo siguiendo Apple Human Interface Guidelines

## Lista de Pantallas

### 1. Home (Calculadora Principal)
**Contenido Principal**:
- Encabezado con título "Calculadora de PSU"
- Formulario de selección de componentes organizado en secciones expandibles
- Botón flotante para calcular PSU
- Resultado del cálculo mostrado de forma prominente

**Funcionalidad**:
- Selección de procesador desde base de datos (marca, socket, modelo)
- Selección de GPU desde base de datos (marca, modelo, número)
- Configuración de RAM (tipo, número de módulos)
- Agregar múltiples dispositivos de almacenamiento (tipo, número)
- Agregar tarjetas adicionales PCI Express (1x4, 1x8, 1x16)
- Configurar unidades ópticas (tipo)
- Configurar ventiladores (cantidad)
- Cálculo automático del consumo total en watts
- Recomendación de PSU con margen de seguridad

### 2. Historial
**Contenido Principal**:
- Lista de configuraciones guardadas previamente
- Cada item muestra: nombre de la configuración, PSU recomendado, fecha

**Funcionalidad**:
- Ver configuraciones anteriores
- Cargar configuración para editar
- Eliminar configuraciones guardadas

### 3. Información
**Contenido Principal**:
- Guía sobre cómo usar la calculadora
- Información sobre márgenes de seguridad recomendados
- Consejos para selección de PSU

## Flujos de Usuario Principales

### Flujo 1: Calcular PSU para nueva PC
1. Usuario abre la app → Pantalla Home
2. Usuario toca sección "Procesador" → Se expande selector
3. Usuario selecciona marca → Filtra modelos
4. Usuario selecciona modelo específico → Se cierra selector
5. Usuario repite para GPU
6. Usuario configura RAM (tipo y cantidad de módulos)
7. Usuario toca "Agregar Almacenamiento" → Sheet modal aparece
8. Usuario selecciona tipo de almacenamiento y cantidad → Confirma
9. Usuario puede agregar más almacenamiento repitiendo paso 7-8
10. Usuario configura tarjetas PCI Express (cantidad de cada tipo)
11. Usuario configura unidades ópticas y ventiladores
12. Usuario toca botón "Calcular PSU" → Resultado aparece en card destacado
13. Usuario puede guardar configuración con un nombre

### Flujo 2: Ver configuración guardada
1. Usuario toca tab "Historial"
2. Usuario ve lista de configuraciones guardadas
3. Usuario toca una configuración → Se carga en pantalla Home
4. Usuario puede editar y recalcular

### Flujo 3: Agregar múltiples dispositivos de almacenamiento
1. En pantalla Home, usuario toca "Agregar Almacenamiento"
2. Sheet modal aparece desde abajo
3. Usuario selecciona tipo (HDD, SSD SATA, SSD NVMe, SSD M.2)
4. Usuario ingresa cantidad
5. Usuario toca "Agregar" → Sheet se cierra
6. Dispositivo aparece en lista de almacenamiento
7. Usuario puede repetir para agregar más tipos

## Paleta de Colores

**Colores Principales**:
- **Primary**: `#0A84FF` (Azul iOS estándar) - Botones principales, acentos
- **Background**: `#FFFFFF` (light) / `#000000` (dark)
- **Surface**: `#F2F2F7` (light) / `#1C1C1E` (dark) - Cards, secciones
- **Foreground**: `#000000` (light) / `#FFFFFF` (dark) - Texto principal
- **Muted**: `#8E8E93` - Texto secundario, labels
- **Border**: `#C6C6C8` (light) / `#38383A` (dark)
- **Success**: `#34C759` - Resultado de cálculo exitoso
- **Warning**: `#FF9500` - Advertencias de consumo alto
- **Error**: `#FF3B30` - Errores de validación

**Aplicación de Colores**:
- Botón principal de cálculo: Background primary con texto blanco
- Cards de componentes: Surface con bordes sutiles
- Resultado de PSU: Card con background success si es seguro, warning si está al límite
- Selectores: Estilo iOS nativo con tint primary

## Componentes de UI Específicos

### Selector de Componente (Procesador/GPU)
- Card expandible con ícono de chevron
- Al tocar se expande mostrando:
  - Selector de marca (horizontal scroll o picker)
  - Lista filtrada de modelos
  - Búsqueda opcional para listas largas

### Lista de Almacenamiento
- Cards apilados verticalmente
- Cada card muestra: tipo, cantidad, consumo estimado
- Botón de eliminar (swipe o botón X)
- Botón "+" flotante para agregar más

### Configurador de Tarjetas PCI
- Tres contadores (stepper) para cada tipo:
  - PCI Express 1x4
  - PCI Express 1x8
  - PCI Express 1x16
- Estilo iOS nativo con botones +/-

### Card de Resultado
- Prominente en la parte superior después de calcular
- Muestra:
  - Consumo total calculado (grande, bold)
  - PSU recomendado (con margen 20-30%)
  - Indicador visual de eficiencia (80+ Bronze, Silver, Gold, etc.)
  - Código de color según margen de seguridad

## Navegación

**Tab Bar** (inferior):
- Tab 1: "Calculadora" (ícono: bolt.fill) → Pantalla Home
- Tab 2: "Historial" (ícono: clock.fill) → Pantalla Historial
- Tab 3: "Info" (ícono: info.circle.fill) → Pantalla Información

## Interacciones

- **Feedback táctil**: Haptic light en botones principales
- **Animaciones**: Transiciones suaves (250ms) para expandir/colapsar secciones
- **Estados de carga**: Spinner durante consultas a base de datos
- **Validación**: Mensajes inline si faltan componentes críticos antes de calcular

## Consideraciones de Diseño

1. **Prioridad de información**: Procesador y GPU son los componentes más críticos, deben estar en la parte superior
2. **Scroll**: La pantalla principal será scrollable dado el número de componentes
3. **Agrupación lógica**: Componentes relacionados agrupados visualmente (ej: todos los dispositivos de almacenamiento juntos)
4. **Accesibilidad**: Tamaños de fuente dinámicos, contraste adecuado, labels descriptivos
5. **Feedback inmediato**: Mostrar consumo parcial mientras se agregan componentes
6. **Persistencia local**: Usar AsyncStorage para guardar configuraciones (no requiere backend)
