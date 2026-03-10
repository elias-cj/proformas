<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Cotizador Premium</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Inter:wght@400;700;900&family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:wght@400;700;900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Oswald:wght@400;700&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:wght@400;700;900&family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body class="antialiased bg-gray-100">
        <div id="proforma-editor"></div>
    </body>
</html>
