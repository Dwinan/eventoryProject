<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Category;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    // ===== Versi React (Inertia) =====

    public function index(Request $request)
    {
        return Inertia::render('Events/Index', $this->indexData($request));
    }

    public function show(Request $request, string $slug)
    {
        return Inertia::render('Events/Show', $this->showData($slug));
    }

    // ===== Versi Blade (untuk screenshot) =====

    public function indexBlade(Request $request)
    {
        return view('events.index', $this->indexData($request));
    }

    public function showBlade(Request $request, string $slug)
    {
        return view('events.show', $this->showData($slug));
    }

    // ===== Data bersama, sama persis untuk kedua versi =====

    private function indexData(Request $request): array
    {
        $categories = Category::all('id', 'name', 'slug');

        $events = Event::where('status', 'published')
            ->with('categories')
            ->when($request->filled('category'), function ($q) use ($request) {
                $q->whereHas('categories', fn ($q) => $q->where('slug', $request->category));
            })
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%');
            })
            ->orderBy('start_at')
            ->paginate(12)
            ->withQueryString();

        return [
            'events' => $events,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search']),
        ];
    }

    private function showData(string $slug): array
    {
        $event = Event::where('slug', $slug)
            ->with(['organization', 'categories'])
            ->firstOrFail();

        $isBookmarked = false;
        $registrationStatus = null;
        $user = Auth::user();

        if ($user) {
            $isBookmarked = Bookmark::where('user_id', $user->id)
                ->where('event_id', $event->id)
                ->exists();

            $registrationStatus = Registration::where('user_id', $user->id)
                ->where('event_id', $event->id)
                ->value('status');
        }

        return [
            'event' => $event,
            'isBookmarked' => $isBookmarked,
            'registrationStatus' => $registrationStatus,
            'user' => $user,
        ];
    }
}