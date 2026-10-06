<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Eventory')</title>
    @vite(['resources/css/app.css'])
</head>
<body class="bg-white text-neutral-900 antialiased">
    <header class="flex items-center gap-4 border-b px-6 py-3">
        <a href="{{ route('blade.events.index') }}" class="font-bold">Eventory</a>
        @auth
            <a href="{{ route('dashboard') }}">Dashboard</a>
            <a href="{{ route('organizer.events.index') }}">Kelola Event</a>
        @else
            <a href="{{ route('login') }}">Masuk</a>
        @endauth
    </header>
    <main class="mx-auto max-w-5xl p-6">
        @if (session('success'))
            <div class="mb-4 rounded bg-green-100 p-3 text-green-800">{{ session('success') }}</div>
        @endif
        @yield('content')
    </main>
</body>
</html>