# URL Shortener - Frontend

## Descripción

Este es el frontend del acortador de URLs, desarrollado con Next.js, React y TypeScript. Proporciona una interfaz moderna y responsive para acortar URLs y visualizar un historial temporal (no persistente) de enlaces generados.

## Tecnologías Utilizadas

### Next.js 14+ (App Router)
**¿Por qué Next.js?**
- **SEO optimizado**: Renderizado del lado del servidor (SSR) y generación estática (SSG) mejoran el posicionamiento en buscadores
- **App Router**: Sistema de enrutamiento moderno basado en carpetas, más intuitivo y potente
- **Developer Experience**: Hot reload, TypeScript integrado, y excelente documentación
- **Despliegue versátil**: Compatible con múltiples plataformas (Firebase, Vercel, AWS, etc.)

### TypeScript
**¿Por qué TypeScript?**
- **Type Safety**: Prevención de errores en tiempo de desarrollo gracias a los tipos
- **Refactoring seguro**: Cambios de código más confiables
- **Escalabilidad**: Facilita el mantenimiento en proyectos grandes
- **Documentación implícita**: Los tipos sirven como documentación del código

### Tailwind CSS
- Framework de utilidades CSS para diseño rápido y consistente
- Sin dependencias de componentes externos
- Diseño totalmente personalizable

## Estructura del Proyecto

```
frontend/
├── app/
│   ├── page.tsx                    # Página principal con el formulario de acortador
│   ├── layout.tsx                  # Layout raíz de la aplicación
│   └── globals.css                 # Estilos globales
├── public/                         # Archivos estáticos
├── .env.local                      # Variables de entorno (desarrollo)
├── .env.production                 # Variables de entorno (producción)
├── next.config.js                  # Configuración de Next.js
├── tailwind.config.js              # Configuración de Tailwind
├── tsconfig.json                   # Configuración de TypeScript
├── firebase.json                   # Configuración de Firebase
├── .firebaserc                     # Proyecto de Firebase
└── package.json                    # Dependencias del proyecto
```



## Configuración de Variables de Entorno

Para una mejor organización, es recomendable utilizar diferentes archivos de entorno para desarrollo y producción.

### Desarrollo Local

Crea un archivo `.env.local` en la raíz del proyecto (/) para la configuración local:

```env
NEXT_PUBLIC_API_URL=https://tu-api-gateway.execute-api.region.amazonaws.com/prod/create
NEXT_PUBLIC_REDIRECT_API_URL=https://tu-api-gateway.execute-api.region.amazonaws.com/prod/redirect
```

### Producción (Firebase)

Crea un archivo `.env.production` en la raíz del proyecto (/) para la configuración de producción:

```env
NEXT_PUBLIC_API_URL=https://tu-api-gateway.execute-api.region.amazonaws.com/prod/create
NEXT_PUBLIC_REDIRECT_API_URL=https://tu-api-gateway.execute-api.region.amazonaws.com/prod/redirect
```


## Instalación y Desarrollo

### Prerequisitos
- Node.js 18+
- npm o yarn
- Cuenta de Firebase

### Instalación

```bash
# Clona el repositorio
git clone https://github.com/Joshe1601/frontend-shortener-url.git
cd frontend-shortener-url

# Instala dependencias
npm install

# Configura tus variables de entorno
cp .env.example .env.local
# Edita el .env.local con tus URLs
```

### Desarrollo Local

```bash
# Inicia servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

### Build de Producción

```bash
# Generar build optimizado
npm run build

# Probar build localmente
npm start
```

## Despliegue en Firebase Hosting

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Iniciar sesión en Firebase

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte con tu cuenta de Google.

### 3. Inicializar Firebase en el proyecto

```bash
firebase init
```

Selecciona las siguientes opciones:
- **Hosting**: Configure files for Firebase Hosting
- **Proyecto**: Selecciona tu proyecto existente o crea uno nuevo
- **Do you want to use a web framework**: `n` (Porque está en etapa experimental)
- **Public directory**: Escribe `out` (Next.js exportará aquí)
- **Single-page app**: `Yes`
- **GitHub deployment**: Opcional (recomendado para CI/CD)

### 4. Configurar Next.js para exportación estática

Edita `next.config.js`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    trailingSlash: false,
    async rewrites() {
        return [
            {
                source: '/:shortCode',
                destination: '/',
            },
        ]
    },
};

module.exports = nextConfig;
```

### 5. Revisar Firebase Hosting

Verifica que el archivo `firebase.json` se vea así:

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 6. Build y Deploy

```bash
# Generar build de producción
npm run build

# Desplegar a Firebase
firebase deploy
```

### 7. Ver tu aplicación

Firebase te mostrará la URL de tu aplicación:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/tu-proyecto
Hosting URL: https://tu-proyecto.web.app
```

## Funcionalidades

### Componente Principal (`app/page.tsx`)
- Formulario para acortar URLs
- Campo opcional para código personalizado
- Validación de URLs
- Historial temporal de URLs acortadas (no persistente)
- Botón de copiar al portapapeles
- Diseño responsive y moderno

### Ruta Dinámica (`app/[shortCode]/page.tsx`)
- Captura cualquier código corto de la URL
- Consulta el API Gateway para obtener la URL original
- Redirección automática
- Pantalla de carga mientras procesa
- Página de error amigable si la URL no existe


## Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm start            # Servidor de producción local
npm run lint         # Linter de código
```

## Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Guía de TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Contribución

Si deseas contribuir al proyecto, por favor:
1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

Desarrollado por Jose Morillos usando Next.js y TypeScript