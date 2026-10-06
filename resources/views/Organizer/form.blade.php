@extends('layouts.app')
@section('title', $event ? 'Ubah Event' : 'Tambah Event')
@section('content')
<h1 class="text-2xl font-bold">{{ $event ? 'Ubah Event' : 'Tambah Event' }}</h1>

<form method="POST" class="mt-4 space-y-3"
      action="{{ $event ? route('organizer.events.update', $event) : route('organizer.events.store') }}">
    @csrf
    @if ($event) @method('PUT') @endif

    @foreach ([
        'title' => ['Judul', 'text'],
        'slug' => ['Slug', 'text'],
        'location' => ['Lokasi', 'text'],
        'quota' => ['Kuota', 'number'],
        'poster' => ['Poster (URL)', 'text'],
    ] as $name => [$label, $type])
        <div>
            <label class="block text-sm">{{ $label }}</label>
            <input type="{{ $type }}" name="{{ $name }}" value="{{ old($name, $event?->$name) }}"
                   class="w-full rounded border p-2">
            @error($name) <p class="text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
    @endforeach

    <div>
        <label class="block text-sm">Deskripsi</label>
        <textarea name="description" rows="5" class="w-full rounded border p-2">{{ old('description', $event?->description) }}</textarea>
        @error('description') <p class="text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    @foreach (['start_at' => 'Mulai', 'end_at' => 'Selesai'] as $name => $label)
        <div>
            <label class="block text-sm">{{ $label }}</label>
            <input type="datetime-local" name="{{ $name }}"
                   value="{{ old($name, $event?->$name?->timezone('Asia/Jakarta')->format('Y-m-d\TH:i')) }}"
                   class="w-full rounded border p-2">
            @error($name) <p class="text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
    @endforeach

    <div>
        <label class="block text-sm">Status</label>
        <select name="status" class="w-full rounded border p-2">
            @foreach (['draft', 'published'] as $s)
                <option value="{{ $s }}" @selected(old('status', $event?->status ?? 'draft') === $s)>{{ $s }}</option>
            @endforeach
        </select>
    </div>

    <div>
        <p class="text-sm">Kategori</p>
        @php $selected = old('categories', $event?->categories->pluck('id')->all() ?? []); @endphp
        @foreach ($categories as $c)
            <label class="mr-3">
                <input type="checkbox" name="categories[]" value="{{ $c->id }}" @checked(in_array($c->id, $selected))>
                {{ $c->name }}
            </label>
        @endforeach
    </div>

    <button class="rounded bg-neutral-900 px-4 py-2 text-white">Simpan</button>
    <a href="{{ route('organizer.events.index') }}" class="ml-2 underline">Batal</a>
</form>
@endsection