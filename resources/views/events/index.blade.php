@extends('layouts.app')
@section('title', 'Daftar Event')
@section('content')
<h1 class="text-2xl font-bold">Daftar Event</h1>

<div class="my-4 flex flex-wrap gap-2">
    <a href="{{ route('blade.events.index') }}"
       class="rounded border px-3 py-1 {{ empty($filters['category']) ? 'bg-neutral-900 text-white' : '' }}">Semua</a>
    @foreach ($categories as $category)
        <a href="{{ route('blade.events.index', ['category' => $category->slug]) }}"
           class="rounded border px-3 py-1 {{ ($filters['category'] ?? null) === $category->slug ? 'bg-neutral-900 text-white' : '' }}">{{ $category->name }}</a>
    @endforeach
</div>

<div class="grid gap-4 md:grid-cols-3">
    @forelse ($events as $event)
        <div class="rounded-lg border p-4">
            <h2 class="font-semibold">
                <a href="{{ route('blade.events.show', $event->slug) }}">{{ $event->title }}</a>
            </h2>
            <p class="text-sm">{{ $event->start_at->timezone('Asia/Jakarta')->locale('id')->translatedFormat('d F Y, H:i') }}</p>
            <p class="text-sm">{{ $event->location }}</p>
            <div class="mt-2">
                @foreach ($event->categories as $c)
                    <span class="mr-1 rounded bg-neutral-100 px-2 text-xs">{{ $c->name }}</span>
                @endforeach
            </div>
        </div>
    @empty
        <p>Belum ada event.</p>
    @endforelse
</div>

<div class="mt-6">{{ $events->links() }}</div>
@endsection