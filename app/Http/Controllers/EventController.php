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
    public function index(Request $request)
    {
        $categories = Category::all('id', 'name', 'slug');

        $query = Event::where('status', 'published')
            ->with('categories')
            ->when($request->filled('category'), function ($q) use ($request) {
                $q->whereHas('categories', fn ($q) => $q->where('slug', $request->category));
            })
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%');
            });

        $events = $query->orderBy('start_at')->paginate(12)->withQueryString();

        $events->getCollection()->each(function ($event) {
            $event->append('is_bookmarked');
        });

        return Inertia::render('Events/Index', [
            'events' => $events,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function show(Request $request, string $slug)
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

        return Inertia::render('Events/Show', [
            'event' => $event,
            'isBookmarked' => $isBookmarked,
            'registrationStatus' => $registrationStatus,
            'user' => $user,
        ]);
    }
}
