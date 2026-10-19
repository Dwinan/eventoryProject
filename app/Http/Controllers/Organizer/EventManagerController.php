<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventManagerController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $organization = $request->user()->organization;

        if (! $organization) {
            return redirect()->route('dashboard');
        }

        $query = Event::where('organization_id', $organization->id)
            ->with('categories');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        $events = $query->orderBy('start_at')
            ->paginate(12)
            ->withQueryString();

        $categories = Category::all('id', 'name', 'slug');

        return Inertia::render('organizer/events/index', [
            'events' => $events,
            'categories' => $categories,
            'filters' => (object) $request->only(['status', 'search']),
        ]);
    }

    public function create(Request $request): Response|RedirectResponse
    {
        $organization = $request->user()->organization;

        if (! $organization) {
            return redirect()->route('dashboard');
        }

        $categories = Category::all('id', 'name', 'slug');

        return Inertia::render('organizer/events/form', [
            'event' => null,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $organization = $request->user()->organization;

        if (! $organization) {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:events,slug',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',
            'quota' => 'nullable|integer|min:1',
            'poster' => 'nullable|image|max:2048',
            'status' => 'required|in:draft,published',
        ]);

        if ($request->hasFile('poster')) {
            $validated['poster'] = $request->file('poster')->store('posters', 'public');
        }

        $validated['organization_id'] = $organization->id;
        $validated['published_at'] = $validated['status'] === 'published' ? now() : null;

        $event = Event::create($validated);

        if ($request->has('categories')) {
            $event->categories()->sync($request->input('categories'));
        }

        return redirect()->route('organizer.events.edit', $event->id)
            ->with('success', 'Event berhasil dibuat.');
    }

    public function edit(Request $request, Event $event): Response
    {
        $organization = $request->user()->organization;

        if (! $organization || $event->organization_id !== $organization->id) {
            abort(403);
        }

        $categories = Category::all('id', 'name', 'slug');

        return Inertia::render('organizer/events/form', [
            'event' => $event->load('categories'),
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $organization = $request->user()->organization;

        if (! $organization || $event->organization_id !== $organization->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:events,slug,'.$event->id,
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',
            'quota' => 'nullable|integer|min:1',
            'poster' => 'nullable|image|max:2048',
            'status' => 'required|in:draft,published',
        ]);

        if ($request->hasFile('poster')) {
            $validated['poster'] = $request->file('poster')->store('posters', 'public');
        } else {
            // jika tidak ada file baru, jangan timpa poster lama
            unset($validated['poster']);
        }

        $validated['published_at'] = $validated['status'] === 'published' ? now() : null;

        $event->update($validated);

        if ($request->has('categories')) {
            $event->categories()->sync($request->input('categories'));
        }

        return redirect()->route('organizer.events.edit', $event->id)
            ->with('success', 'Event berhasil diperbarui.');
    }

    public function destroy(Request $request, Event $event): RedirectResponse
    {
        $organization = $request->user()->organization;

        if (! $organization || $event->organization_id !== $organization->id) {
            abort(403);
        }

        $event->delete();

        return redirect()->route('organizer.events.index')
            ->with('success', 'Event berhasil dihapus.');
    }
}
