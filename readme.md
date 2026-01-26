# Descripción del Proyecto

Este proyecto es un bot de WhatsApp desarrollado utilizando la biblioteca `whatsapp-web.js`.El bot está diseñado para interactuar con los usuarios de WhatsApp, respondiendo a mensajes y realizando diversas tareas automatizadas.

## Cónfiguración del Entorno de Desarrollo

1. Clona este repositorio en tu máquina local.

2. Navega al directorio del proyecto:
```bash
cd nombre-del-proyecto
```

3. Instala las dependencias necesarias utilizando npm:
```bash 
pnpm install
```

4. Asegúrate de tener Node.js instalado en tu sistema. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).

5. Configura las variables de entorno necesarias. Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:
```bash
LLM_API_KEY=tu_api_key_aqui
DATABASE_URL=tu_url_de_base_de_datos_aqui
```

6. Configura la base de datos si es necesario. Asegúrate de que la base de datos esté en funcionamiento y que las credenciales en el archivo `.env` sean correctas.

7. Aplica las migraciones de la base de datos si es necesario:
```bash
pnpx prisma migrate dev
```

8. Genera los tipos de Prisma:
```bash
pnpx prisma generate
```

9. Inicia el bot ejecutando el siguiente comando:
```bash
pnpm start
```
Te pedirá escanear un código QR con tu aplicación de WhatsApp para autenticar el bot.

## Pendientes

- [x] Configurar el entorno de desarrollo para que deapseek conteste.
