@extends('layouts.app')
@section('title', $event->title)
@section('content')
<a href="{{ route('blade.events.index') }}">&larr; Kembali</a>
<h1 class="mt-2 text-3xl font-bold">{{ $event->title }}</h1>
<p>Oleh {{ $event->organization?->name ?? '-' }}</p>
<p>
    {{ $event->start_at->timezone('Asia/Jakarta')->locale('id')->translatedFormat('d F Y, H:i') }}
    &ndash;
    {{ $event->end_at->timezone('Asia/Jakarta')->locale('id')->translatedFormat('d F Y, H:i') }}
</p>
<p>{{ $event->location }}</p>
<p>Kuota: {{ $event->quota ?? 'Tidak dibatasi' }}</p>
<div class="my-2">
    @foreach ($event->categories as $c)
        <span class="mr-1 rounded bg-neutral-100 px-2 text-xs">{{ $c->name }}</span>
    @endforeach
</div>
<p class="mt-4 whitespace-pre-line">{{ $event->description }}</p>

@auth
    <p class="mt-4">Bookmark: {{ $isBookmarked ? 'Ya' : 'Belum' }}</p>
    <p>Status pendaftaran: {{ $registrationStatus ?? 'Belum mendaftar' }}</p>
    @if (auth()->id() === $event->organization?->user_id)
        <a href="{{ route('organizer.events.edit', $event) }}" class="underline">Ubah event</a>
    @endif
@endauth
@endsection