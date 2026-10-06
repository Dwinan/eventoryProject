@extends('layouts.app')
@section('title', 'Kelola Event')
@section('content')
<div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Kelola Event</h1>
    <a href="{{ route('organizer.events.create') }}" class="rounded bg-neutral-900 px-3 py-1 text-white">Tambah Event</a>
</div>

<table class="mt-4 w-full text-left text-sm">
    <thead><tr><th>Judul</th><th>Status</th><th>Mulai</th><th></th></tr></thead>
    <tbody>
    @foreach ($events as $event)
        <tr class="border-t">
            <td>{{ $event->title }}</td>
            <td>{{ $event->status }}</td>
            <td>{{ $event->start_at->timezone('Asia/Jakarta')->locale('id')->translatedFormat('d F Y, H:i') }}</td>
            <td class="flex gap-2">
                <a href="{{ route('organizer.events.edit', $event) }}" class="underline">Ubah</a>
                <form method="POST" action="{{ route('organizer.events.destroy', $event) }}"
                      onsubmit="return confirm('Hapus event ini?')">
                    @csrf @method('DELETE')
                    <button class="text-red-600 underline">Hapus</button>
                </form>
            </td>
        </tr>
    @endforeach
    </tbody>
</table>
<div class="mt-4">{{ $events->links() }}</div>
@endsection