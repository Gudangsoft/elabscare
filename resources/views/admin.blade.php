<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- SEO Meta Tags for Admin --}}
    <title inertia>@yield('title', 'eLabCare Admin - Advanced Medical Analysis Management System')</title>
    <meta name="description" content="eLabCare Admin Dashboard - Comprehensive medical analysis management system for healthcare professionals. Manage patient data, lab parameters, health records, and medical insights efficiently.">
    <meta name="keywords" content="medical admin, healthcare management, lab management system, patient data management, medical dashboard, eLabCare admin, healthcare professionals, medical analysis management">
    <meta name="author" content="eLabCare">
    <meta name="robots" content="noindex, nofollow"> {{-- Admin pages shouldn't be indexed --}}
    
    {{-- Security Headers --}}
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <meta name="referrer" content="strict-origin-when-cross-origin">

    {{-- Existing scripts and styles --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';
            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    <style>
        html {
            background-color: oklch(1 0 0);
        }
        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <link rel="icon" href="/assets/pwa/images/logo/logo-head.png" sizes="any">
    <link rel="icon" href="/assets/pwa/images/logo/logo-head.png" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/assets/pwa/images/logo/logo-head.png">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    {{-- Admin CSS Files --}}
    <link rel="icon" type="image/png" href="/assets/images/favicon.png" sizes="16x16">
    <link rel="stylesheet" href="/assets/admin/css/remixicon.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/apexcharts.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/dataTables.min.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/editor-katex.min.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/editor.atom-one-dark.min.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/editor.quill.snow.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/flatpickr.min.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/full-calendar.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/jquery-jvectormap-2.0.5.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/magnific-popup.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/slick.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/prism.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/file-upload.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/audioplayer.css">
    <link rel="stylesheet" href="/assets/admin/css/lib/animate.min.css">
    <link rel="stylesheet" href="/assets/admin/css/style.css">
    <link rel="stylesheet" href="/assets/admin/css/extra.css">

    @routes
    @viteReactRefresh
    @vite(['resources/js/admin/app.tsx', "resources/js/admin/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>