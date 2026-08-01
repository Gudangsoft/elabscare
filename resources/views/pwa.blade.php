<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- SEO Meta Tags --}}
        <title inertia>@yield('title', 'eLabCare - Advanced Medical Analysis & Health Monitoring Platform')</title>
        <meta name="description" content="eLabCare provides advanced medical analysis tools to help you understand your health better. Monitor lab results, track health trends, and get personalized health insights with our comprehensive medical platform.">
        <meta name="keywords" content="medical analysis, health monitoring, lab results, health trends, medical platform, eLabCare, health insights, medical dashboard, laboratory management">
        <meta name="author" content="eLabCare">

        {{-- Open Graph Meta Tags --}}
        <meta property="og:title" content="eLabCare - Advanced Medical Analysis & Health Monitoring">
        <meta property="og:description" content="Transform your health management with eLabCare's advanced medical analysis tools. Track lab results, monitor health trends, and get personalized insights.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ asset('images/og-image.png') }}">
        <meta property="og:site_name" content="eLabCare">

        {{-- Twitter Card Meta Tags --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="eLabCare - Advanced Medical Analysis & Health Monitoring">
        <meta name="twitter:description" content="Transform your health management with eLabCare's advanced medical analysis tools. Track lab results, monitor health trends, and get personalized insights.">
        <meta name="twitter:image" content="{{ asset('images/twitter-card.png') }}">

        {{-- PWA Meta Tags --}}
        <meta name="theme-color" content="#0d9488">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="eLabCare">

        {{-- Canonical URL --}}
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- Existing scripts and styles --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';
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

        {{-- PWA Manifest --}}
        <link rel="manifest" href="/manifest.json">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/pwa/app.tsx', "resources/js/pwa/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
