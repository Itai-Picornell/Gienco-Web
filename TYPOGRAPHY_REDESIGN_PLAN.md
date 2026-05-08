# Plan de Reestructuración Tipográfica Integral — Gienco Web
**Fecha**: Mayo 2026  
**Objetivo**: Transición de sistema tipográfico a Bebas Neue + Roboto con jerarquía visual matemática

---

## 1. ANÁLISIS ARQUITECTÓNICO ACTUAL

### Stack Tecnológico
- **Framework**: Vue 3.4 + Vite 6
- **Estilos**: Tailwind CSS v4 con @theme
- **Sistema de Diseño**: Tokens CSS personalizados en @theme
- **Tipografías actuales**:
  - Display: `Cinzel Decorative` (serif)
  - Body: `Manrope`, `Inter` (sans-serif)

### Estructura de Componentes
```
├── Views (páginas completas)
│   ├── Home.vue (hero + releases + eventos)
│   ├── Products.vue (grid de productos)
│   ├── Cart.vue, Checkout.vue, OrderSuccess.vue
│   ├── Login.vue, SignUp.vue, ResetPassword.vue
│   └── Legal (TermsOfService.vue, PrivacyPolicy.vue)
├── Components (componentes reutilizables)
│   ├── Navbar.vue (navegación + menú user)
│   ├── Footer.vue (enlaces + redes)
│   ├── BandCarousel.vue (carrusel de imágenes)
│   ├── EventsCalendar.vue (calendario de eventos)
│   └── NotificationModal.vue
└── Stores (Pinia) + Composables
```

---

## 2. ESCALA TIPOGRÁFICA MODULAR (Escala 1.125 — Major Second)

### Jerarquía de Tamaños — BEBAS NEUE (Titulares)
| Nivel | Uso | Tamaño | Line-Height | Letter-Spacing | Font-Weight | Ejemplo |
|-------|-----|--------|-------------|----------------|------------|---------|
| **H1 Hero** | Display máximo impacto | 72px | 1.0 | 2px | 700 | Wordmark, hero principal |
| **H1** | Títulos principales secciones | 56px | 1.1 | 1.5px | 700 | "Nuestros Proyectos", "Próximos Eventos" |
| **H2** | Subtítulos, secciones secundarias | 44px | 1.15 | 1px | 700 | Headings de cards principales |
| **H3** | Tertiary headings, labels destacados | 34px | 1.2 | 0.5px | 600 | Títulos de subsecciones |
| **H4** | Mini headings, botones prominentes | 28px | 1.25 | 0.25px | 600 | CTA labels, títulos de cards |

### Jerarquía de Tamaños — ROBOTO (Body & Lectura)
| Nivel | Uso | Tamaño | Line-Height | Letter-Spacing | Font-Weight | Ejemplo |
|-------|-----|--------|-------------|----------------|------------|---------|
| **Body-Large** | Párrafos principales, descripciones destacadas | 18px | 1.6 | 0px | 400 | Descripción hero, textos informativos |
| **Body** | Texto general, párrafos largos | 16px | 1.6 | 0px | 400 | Descripciones de productos, contenido legal |
| **Body-Small** | Información secundaria, metadata | 14px | 1.5 | 0px | 400 | Fechas, precios, descripciones cortas |
| **Caption** | Etiquetas, fichas técnicas | 12px | 1.4 | 0.5px | 500 | Labels, footnotes, copyright |
| **Caption-Tiny** | Micro-texto, disclaimers | 11px | 1.3 | 0px | 400 | Avisos legales pequeños |

### Pesos de ROBOTO para Sub-jerarquía
- **Light (300)**: Texto de baja prioridad, subtítulos suaves
- **Regular (400)**: Texto por defecto
- **Medium (500)**: Énfasis suave (subtítulos, metadata destacada)
- **Bold (700)**: Énfasis fuerte, elementos interactivos

---

## 3. ASIGNACIÓN TIPOGRÁFICA POR COMPONENTE

### Navbar.vue
| Elemento | Tipografía | Tamaño | Peso | Propósito |
|----------|-----------|--------|------|----------|
| Logo wordmark | Bebas Neue | 28px | 700 | Identidad visual |
| Nav items | Roboto | 13px | 500 | Navegación clara |
| User menu label | Roboto | 13px | 500 | Acciones contextuales |
| Carrito badge | Roboto | 10px | 700 | Contador |

### Home.vue Hero
| Elemento | Tipografía | Tamaño | Peso | Notas |
|----------|-----------|--------|------|-------|
| H1 (hero title) | Bebas Neue | 56–72px | 700 | Responsive: 56px mobile, 72px desktop |
| Kicker ("Nuevo Lanzamiento") | Bebas Neue | 14px | 600 | Uppercase, tracking 2px |
| Releases heading | Bebas Neue | 56px | 700 | Puede crecer en desktop |
| Releases body | Roboto | 16–18px | 400 | Line-height 1.6 para legibilidad |
| Events heading | Bebas Neue | 48px | 700 | Sección secundaria |

### Products.vue
| Elemento | Tipografía | Tamaño | Peso | Notas |
|----------|-----------|--------|------|-------|
| Hero title | Bebas Neue | 48–56px | 700 | Impacto en listado |
| Hero subtitle | Roboto | 18px | 400 | Contexto, Light si es muted |
| Nombre producto (card) | Bebas Neue | 20px | 600 | Atrae atención en grid |
| Precio | Roboto | 16px | 700 | Bold para legibilidad |
| Descripción producto | Roboto | 14px | 400 | Compact, información secundaria |
| Botón "Añadir" | Roboto | 14px | 600 | Clarity over decorative |

### Footer.vue
| Elemento | Tipografía | Tamaño | Peso | Notas |
|----------|-----------|--------|------|-------|
| "Gienco" brand | Bebas Neue | 28px | 700 | Identidad, uppercase |
| Copyright | Roboto | 13px | 400 | Información legal |
| Enlaces footer | Roboto | 13px | 400 | Navegación |
| Redes (aria-label) | Roboto | 12px | 500 | Micro-texto |

### BandCarousel.vue
| Elemento | Tipografía | Tamaño | Peso | Notas |
|----------|-----------|--------|------|-------|
| Section heading | Bebas Neue | 44px | 700 | Impacto visual |
| Aria-labels (botones) | Roboto | 12px | 500 | Accesibilidad |

### Botones & CTAs (Estrategia)
**Decisión**: **Roboto Medium/Bold** en botones principales para máxima legibilidad.
- **CTA primaria**: Roboto 14px Bold + background color-primary
- **CTA secundaria**: Roboto 13px Medium + border
- **CTA text**: Roboto 12px Medium + hover text-gold

---

## 4. CAMBIOS EN index.css

### 4.1 Importación de Fuentes Google Fonts
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400;500;700&display=swap');
```

### 4.2 Actualización de variables @theme
```css
--font-display: "Bebas Neue", "Cinzel Decorative", serif;
--font-sans: "Roboto", "Manrope", "Inter", system-ui, sans-serif;

/* Escalas explícitas para Bebas Neue */
--font-size-h1-hero: 72px;
--font-size-h1: 56px;
--font-size-h2: 44px;
--font-size-h3: 34px;
--font-size-h4: 28px;

/* Escalas para Roboto */
--font-size-body-large: 18px;
--font-size-body: 16px;
--font-size-body-small: 14px;
--font-size-caption: 12px;
--font-size-caption-tiny: 11px;

/* Line-heights */
--line-height-tight: 1.0;
--line-height-normal: 1.25;
--line-height-relaxed: 1.6;

/* Letter-spacing (tracking) */
--tracking-normal: 0px;
--tracking-wide: 0.5px;
--tracking-wider: 1px;
--tracking-widest: 2px;
```

### 4.3 Estilos globales para headings
```css
h1 { font-family: var(--font-display); font-size: var(--font-size-h1); font-weight: 700; line-height: 1.1; }
h2 { font-family: var(--font-display); font-size: var(--font-size-h2); font-weight: 700; line-height: 1.15; }
h3 { font-family: var(--font-display); font-size: var(--font-size-h3); font-weight: 600; line-height: 1.2; }
h4 { font-family: var(--font-display); font-size: var(--font-size-h4); font-weight: 600; line-height: 1.25; }
p { font-family: var(--font-sans); font-size: var(--font-size-body); font-weight: 400; line-height: 1.6; }
```

---

## 5. UTILIDADES TAILWIND PERSONALIZADAS

Agregar a `@theme` en index.css para facilitar uso en templates:

```css
@theme {
  /* Tipografías */
  --font-family-display: "Bebas Neue", serif;
  --font-family-sans: "Roboto", system-ui, sans-serif;
  
  /* Tamaños de fuente con nombres semánticos */
  --font-size-h1-hero: 72px;
  --font-size-h1: 56px;
  --font-size-h2: 44px;
  --font-size-h3: 34px;
  --font-size-h4: 28px;
  --font-size-body-large: 18px;
  --font-size-body: 16px;
  --font-size-body-small: 14px;
  --font-size-caption: 12px;
}
```

Esto permite usar en HTML: `class="text-h1 font-display"` o crear atajos.

---

## 6. IMPACTO POR VISTA/COMPONENTE

### High Priority (Cambios Críticos)
1. **Navbar.vue**: Logo + navegación (identidad)
2. **Home.vue**: Hero + headings principales (primer contacto)
3. **Products.vue**: Nombres de productos + CTA (conversión)
4. **Botones & CTAs**: Consistencia global

### Medium Priority
5. **BandCarousel.vue**: Headings de secciones
6. **EventsCalendar.vue**: Fechas y etiquetas
7. **Footer.vue**: Identidad + links

### Low Priority (Refinamiento)
8. **Vistas de carrito/checkout**: Confirmación visual
9. **Textos legales**: Legibilidad
10. **Notificaciones**: Consistencia

---

## 7. VERIFICACIÓN Y QA

### Puntos de Control
- [ ] Tipografías cargadas correctamente (Google Fonts)
- [ ] Responsive en mobile/tablet/desktop
- [ ] Contraste de color suficiente (WCAG AA)
- [ ] Performance (no lag por fuentes grandes)
- [ ] Fallbacks: si Google Fonts falla, caer a serif/sans-serif genéricos
- [ ] Consistencia visual en toda la app

### Testing
- Visual regression: comparar antes/después en navegadores
- Accesibilidad: verificar con herramientas de a11y
- Performance: Lighthouse scores
- Print styles (si aplica para documentos legales)

---

## 8. LISTA DE ARCHIVOS A MODIFICAR

### Ficheros CSS/Tailwind
1. **src/index.css** — Variables @theme + imports de fuentes

### Componentes Vue (Templates)
1. **src/App.vue** — Font global
2. **src/components/Navbar.vue**
3. **src/components/Footer.vue**
4. **src/components/BandCarousel.vue**
5. **src/components/EventsCalendar.vue**
6. **src/views/Home.vue**
7. **src/views/Products.vue**
8. **src/views/Cart.vue**
9. **src/views/Checkout.vue**
10. **src/views/Login.vue**, **SignUp.vue**, **ResetPassword.vue**
11. **src/views/TermsOfService.vue**, **PrivacyPolicy.vue**

### Archivos No Modificables
- `package.json`, `vite.config.js` — No requieren cambios
- `stores/`, `services/`, `composables/` — Lógica sin cambios

---

## 9. ORDEN DE IMPLEMENTACIÓN

**Fase 1 (Foundational)**
1. Actualizar `src/index.css` (imports + variables)
2. Actualizar `src/App.vue` (font body global)

**Fase 2 (Navigation & Identity)**
3. `src/components/Navbar.vue`
4. `src/components/Footer.vue`

**Fase 3 (Content Hierarchy)**
5. `src/views/Home.vue`
6. `src/components/BandCarousel.vue`
7. `src/views/Products.vue`

**Fase 4 (Conversions & Forms)**
8. `src/views/Cart.vue`, `Checkout.vue`, `OrderSuccess.vue`
9. `src/views/Login.vue`, `SignUp.vue`, `ResetPassword.vue`

**Fase 5 (Legal & Refinement)**
10. `src/views/TermsOfService.vue`, `PrivacyPolicy.vue`
11. QA final + ajustes de contraste/spacing

---

## 10. NOTAS TÉCNICAS

- **Google Fonts**: Usar `?display=swap` para evitar bloqueos de rendering
- **Fallbacks**: Cascade correcto `"Bebas Neue", "Cinzel Decorative", serif`
- **Responsive**: Usar `@apply` o clases Tailwind para media queries
- **Performance**: Bebas Neue es pequeña (~30KB woff2), Roboto (~40KB), total ~70KB aceptable
- **Compatibilidad**: Soportan IE11+ pero recomendamos navegadores modernos

---

**Estado**: Listo para implementación
**Última actualización**: Mayo 8, 2026
