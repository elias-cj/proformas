# Sistema Interno de Gestión de Servicios

Repositorio del sistema ERP / CRM para gestión automatizada de servicios y finanzas, construido con:

- **Back-End**: Laravel 10 (PHP 8.1)
- **Front-End**: React + Vite
- **Estilos**: Tailwind CSS

## 📌 Guía Rápida de Operaciones

### Instalación en Servidor (Producción o Staging)

1. **Clonar Repo e Instalar Dependencias**
    ```bash
    composer install --optimize-autoloader --no-dev
    npm install && npm run build
    ```
2. **Configuración Inicial**
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
3. **Base de Datos**
   Ajustar variables de entorno en el `.env` (MySQL/MariaDB).
    ```bash
    php artisan migrate --seed
    ```
4. **Almacenamiento (Archivos, Membretes y PDF)**
   Es **MANDATORIO** enlazar el storage para que se publiquen los archivos:
    ```bash
    php artisan storage:link
    ```

### ⚙️ Automatización (Cron Jobs)

El sistema emplea tareas en segundo plano que marcan proformas vencidas y generan copias de seguridad. En el servidor (Linux), debe existir una única entrada en el Crontab:

```bash
* * * * * cd /ruta-a-tu-proyecto && php artisan schedule:run >> /dev/null 2>&1
```

_Esto invocará rutinariamente `proformas:mark-vencidas` y `backup:run` en los horarios indicados en el `Kernel.php`._

---

## 🛡️ Aspectos de Seguridad Destacados

- **Rate Limiting**: La API local contiene un protector configurado a `60` requests por minuto por usuario/IP contra fuerza bruta (En `RouteServiceProvider`).
- **Validación Estricta**: Controladores como Documentos y Justificantes restringen agresivamente extensiones (`mimes:pdf,jpg,png...`) y limitan su tamaño para mitigar _Remote Code Execution_.
- **Auditoría Global**: Incorpora un Global Observer (`AuditObserver`) sobre tablas críticas (`WorkOrders`, `Proformas`, `CashMovements`...) registrando `new_values` y `old_values`.

## 📦 Arquitectura de Módulos (Topología)

1. **Catálogos y Usuarios**: `User`, `Role`, `Customer`, `Service`, `Product`.
2. **Core Comercial**: `Proforma`, `ProformaDetail` (Con exportación de PDF dinámicos A4 sobre membretes renderizados en DOMPDF).
3. **Core Operativo**: `WorkOrder`, `Technician`, `WorkOrderHistory`, `Justifier`. Automático -> Las órdenes nacen de las proformas Aceptadas.
4. **Flujo Cajas (Finanzas)**: `CashRegister`, `CashOpening`, `CashMovement`, `Payment`, `Expense`.

---

### Contacto y Soporte Técnico

Para debatir la topología del API RESTful referirse a la colección exportada en Postman o en su defecto invocar las rutas ejecutando `php artisan route:list`.
