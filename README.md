# Cybermoon - Frontend Installation Guide

Este README explica cómo instalar y ejecutar el **frontend** de Cybermoon (React + TypeScript + Vite) en cualquier máquina que clone el repositorio. El proyecto integra Supabase para autenticación y DB, pero asume que el backend/DB está configurado previamente (ver documentación separada para Supabase setup).

## Requisitos Previos

- **Node.js**: v18 o superior (incluye npm). Descarga: [nodejs.org](https://nodejs.org/).  
- **Git**: Para clonar el repo. Descarga: [git-scm.com](https://git-scm.com/).  
- **Editor**: VS Code recomendado con extensions: Tailwind CSS IntelliSense, TypeScript, React.  
- **Supabase Project**: Crea uno en [supabase.com](https://supabase.com/) y obtén URL + anon key (ver paso 2).

## Instalación Paso a Paso

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/cybermoon.git  # Reemplaza con tu URL de repo.
cd cybermoon
```

### 2. Configurar Variables de Entorno (Supabase)
1. Crea archivo `.env.local` en la raíz del proyecto:  
   ```
   VITE_SUPABASE_URL=tu_project_url_supabase  # Ej: https://abc123.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_anon_key_supabase  # Copia de Supabase Settings > API
   ```
   - **Nota**: Agrega `.env.local` a `.gitignore` para no subir keys.  
   - Si no tienes Supabase: Crea proyecto gratuito, habilita Auth (email), y ejecuta SQL scripts para tablas (ver Anexo A).

### 3. Instalar Dependencias
```bash
npm install
```
- Instala React, Vite, Shadcn/UI, Framer Motion, React Router, TanStack Query, Supabase client, Lucide icons, etc.

### 4. Configurar UI Components (Shadcn – Primera Vez)
Si no lo hiciste:  
```bash
npx shadcn-ui@latest init  # Config Tailwind/TS.
npx shadcn-ui@latest add button input select card skeleton toaster  # Agrega componentes usados.
```

### 5. Seed Datos Iniciales (Opcional para Dev)
- En el navegador (después de correr dev): F12 > Console, ejecuta:  
  ```js
  import { initializeMockData } from './src/utils/mockData';
  await initializeMockData();  // Crea usuarios, PCs, sesiones, predicciones en Supabase.
  ```
- O en `App.tsx` (useEffect): Ya configurado para auto-seed.

### 6. Ejecutar en Desarrollo
```bash
npm run dev
```
- Abre [http://localhost:8080](http://localhost:8080).  
- Regístrate/login (admin con invite 'CYBER2025').  
- Prueba: /dashboard/admin – sesiones/PCs de Supabase.

### 7. Build y Preview para Producción
```bash
npm run build  # Crea /dist.
npm run preview  # Local preview de build.
```
- Deploy: Vercel/Netlify (conecta repo, env vars automáticas).

## Troubleshooting

- **"VITE_SUPABASE_URL undefined"**: Verifica `.env.local` y reinicia `npm run dev`.  
- **No data en dashboard**: Ejecuta seed (console o App). Chequea Supabase Table Editor.  
- **RLS denied**: Desactiva RLS temporal en Table Editor (para test).  
- **Dependencias fallan**: `npm install --force` o borra `node_modules` + `npm install`.  
- **Porta ocupada**: Cambia en `vite.config.ts` o mata proceso (`npx kill-port 8080`).

## Estructura del Proyecto (Frontend)

```
cybermoon/
├── src/
│   ├── components/     # UI: Sidebar, shadcn/ui.
│   ├── contexts/       # AuthContext, SidebarContext.
│   ├── pages/          # Index, Login, admin/client routes.
│   ├── utils/          # mockData.ts (queries Supabase).
│   ├── lib/supabase.ts # Client Supabase.
│   ├── App.tsx         # Routes + Providers.
│   └── main.tsx        # Root.
├── .env.local          # Supabase keys (gitignore).
├── vite.config.ts      # Bundler.
├── tsconfig.json       # TS config.
└── package.json        # Deps/scripts.
```

## Contribuyendo

Forkea, crea branch (`git checkout -b feature/xyz`), commit, PR. Usa Prettier/ESLint.

## Licencia

MIT – ver LICENSE.

## Contacto

[tu-email@ejemplo.com]. ¡Gracias por clonar Cybermoon! 🚀








# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/8f396aea-8da0-4f30-bc78-5813d18eea5c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/8f396aea-8da0-4f30-bc78-5813d18eea5c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8f396aea-8da0-4f30-bc78-5813d18eea5c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
