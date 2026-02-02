# TODO - PSU Pulse

## Base de Datos y Backend
- [x] Diseñar esquema MongoDB para procesadores (marca, socket, modelo, consumo_watts)
- [x] Diseñar esquema MongoDB para GPUs (marca, modelo, numero, consumo_watts)
- [x] Diseñar esquema MongoDB para tipos de almacenamiento (tipo, consumo_watts_promedio)
- [x] Crear datos de ejemplo para procesadores populares
- [x] Crear datos de ejemplo para GPUs populares
- [x] Crear datos de ejemplo para tipos de almacenamiento
- [x] Implementar endpoint API para obtener lista de procesadores
- [x] Implementar endpoint API para obtener lista de GPUs filtradas por marca
- [x] Implementar endpoint API para obtener tipos de almacenamiento
- [x] Implementar endpoint API para guardar configuraciones de usuario
- [x] Implementar endpoint API para obtener historial de configuraciones

## Interfaz de Usuario
- [x] Actualizar tab bar con iconos: calculadora, historial, info
- [x] Crear componente selector expandible para procesador
- [x] Crear componente selector expandible para GPU
- [x] Crear componente configurador de RAM (tipo y número de módulos)
- [x] Crear componente para agregar múltiples dispositivos de almacenamiento
- [x] Crear modal/sheet para agregar nuevo dispositivo de almacenamiento
- [x] Crear componente stepper para tarjetas PCI Express (1x4, 1x8, 1x16)
- [x] Crear componente configurador de unidades ópticas
- [x] Crear componente configurador de ventiladores
- [x] Crear card de resultado de cálculo con PSU recomendado
- [x] Implementar pantalla de historial de configuraciones
- [x] Implementar pantalla de información y ayuda

## Lógica de Cálculo
- [x] Implementar función de cálculo de consumo de procesador
- [x] Implementar función de cálculo de consumo de GPU
- [x] Implementar función de cálculo de consumo de RAM
- [x] Implementar función de cálculo de consumo de almacenamiento
- [x] Implementar función de cálculo de consumo de tarjetas PCI Express
- [x] Implementar función de cálculo de consumo de unidades ópticas
- [x] Implementar función de cálculo de consumo de ventiladores
- [x] Implementar función de cálculo total y recomendación de PSU con margen de seguridad
- [x] Implementar validación de componentes mínimos requeridos

## Persistencia y Estado
- [ ] Configurar AsyncStorage para guardar configuraciones localmente
- [ ] Implementar función para guardar configuración actual
- [ ] Implementar función para cargar configuración guardada
- [ ] Implementar función para eliminar configuración guardada
- [ ] Implementar estado global para componentes seleccionados

## Branding y Assets
- [x] Generar logo personalizado para la aplicación
- [x] Actualizar app.config.ts con nombre "PSU Pulse" y logo de la app
- [x] Configurar colores del tema en theme.config.js

## Testing y Validación
- [x] Probar flujo completo de selección de componentes
- [x] Probar cálculo de PSU con diferentes configuraciones
- [ ] Probar guardado y carga de configuraciones
- [x] Validar integración con MongoDB
- [ ] Verificar funcionamiento en modo oscuro


## Cambios Recientes
- [x] Ajustar altura máxima de modales para evitar interferencia con botones de navegación
- [x] Poblar base de datos con histórico de 10 años de componentes
- [x] Implementar logos profesionales con variaciones (azul, oscuro, blanco, naranja)


## Migración a Serverless (JSON)
- [x] Crear archivos JSON con datos de procesadores, GPUs y almacenamiento
- [x] Reemplazar API tRPC con funciones locales que leen JSON
- [x] Actualizar componentes UI para usar datos locales
- [ ] Remover dependencias de base de datos y servidor
- [x] Probar aplicación serverless completa
