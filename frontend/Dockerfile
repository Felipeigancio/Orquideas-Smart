# Etapa 1: Build con Node 20
FROM node:20 AS build

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar todo el código
COPY . .

# Construir Vite
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar los archivos generados al directorio web de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto del contenedor
EXPOSE 5173

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]



