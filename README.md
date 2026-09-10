# Avoris · Maquetación responsive

Implementación del diseño proporcionado en Figma para la prueba técnica de maquetación web.

## 1. Decisiones técnicas

### Tecnologías

- **HTML5 semántico** para estructurar el contenido y facilitar accesibilidad y mantenimiento.
- **CSS3 + Sass (SCSS)** para los estilos. Sass se utiliza para organizar el código por responsabilidades y mantener una estructura escalable.
- **JavaScript vanilla (ES6+)** para la interacción y la generación dinámica de contenido.
- **Sin framework frontend** (React, Angular, Vue, etc.). Se ha optado por JavaScript nativo porque la interfaz no necesita la complejidad adicional de un framework y permite mantener una solución ligera.
- **Sin librerías externas de UI**. Los componentes visuales y las interacciones se han implementado de forma propia para mantener el control sobre el resultado y aproximarlo al diseño de Figma.

### Organización de estilos

Los estilos SCSS están separados por responsabilidad:

```text
styles.scss
└── styles/
    ├── colors.scss
    ├── typography.scss
    ├── global.scss
    ├── atoms/
    ├── components/
    └── layouts/
```

Esta organización permite separar tokens y reglas globales de componentes concretos y de la estructura de las distintas zonas de la página.

Los nombres de las clases siguen una convención basada en **BEM**, con bloques, elementos y modificadores (`block`, `block__element`, `block--modifier`) para hacer el CSS más predecible y mantenible.

### Contenido y renderizado dinámico

Los elementos repetitivos, como las tarjetas de resultados, se generan desde estructuras de datos en JavaScript en lugar de duplicar manualmente el mismo HTML.

Los textos están centralizados en `translations.js`, utilizando claves `data-i18n` para facilitar la internacionalización y evitar dispersar los textos por la lógica de la aplicación.

Los iconos también están desacoplados del HTML: sus rutas se mantienen en `main.js` mediante `iconPaths` y se cargan desde `assets/icons/`. De este modo, el HTML no contiene SVG hardcodeados y los iconos pueden reutilizarse de forma consistente.

### Responsive

La interfaz se ha planteado para adaptarse a:

- escritorio;
- tablet;
- móvil.

Los cambios de distribución, navegación, filtros y componentes se resuelven mediante CSS responsive y comportamiento JavaScript cuando es necesario.

### Accesibilidad

Se han utilizado elementos HTML semánticos (`header`, `nav`, `main`, `section`, `aside`, `footer`, `dialog`, etc.), atributos ARIA cuando aportan información adicional y controles nativos para botones, enlaces, formularios y checkboxes.

También se han tenido en cuenta estados interactivos y etiquetas accesibles para elementos que dependen de iconos.

## 2. Instalación y visualización local

### Requisitos

- Node.js y npm instalados.
- Un navegador moderno.
- VS Code u otro editor es opcional.

### Instalación

Desde la carpeta raíz del proyecto:

```bash
npm install
```

Esto instala las dependencias de desarrollo, principalmente Sass.

### Compilar Sass

Para mantener `styles.css` actualizado mientras se trabaja:

```bash
npm run sass
```

El script está configurado en modo `watch`, por lo que permanece activo y recompila los cambios en los archivos `.scss`.

### Visualizar el proyecto

La forma recomendada es abrir la carpeta del proyecto con VS Code y utilizar **Live Server** (o cualquier servidor HTTP local) para servir `index.html`.

También es posible abrir `index.html` directamente en el navegador cuando los recursos ya estén compilados, aunque para desarrollo se recomienda un servidor local.

La estructura esperada en la raíz es:

```text
index.html
main.js
translations.js
styles.scss
styles.css
package.json
package-lock.json
styles/
assets/
```


