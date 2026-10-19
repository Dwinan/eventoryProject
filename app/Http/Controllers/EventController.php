<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Category;
use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('events/index', $this->indexData($request));
    }

    public function show(Request $request, string $slug): Response
    {
        return Inertia::render('events/show', $this->showData($slug));
    }

    /**
     * @return array{events: LengthAwarePaginator<int, Event>, categories: Collection<int, Category>, filters: object}
     */
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
            // cast ke object: only() balikin [] saat kosong, bikin filters.sort = Array.prototype.sort di JS
            'filters' => (object) $request->only(['category', 'search', 'sort']),
        ];
    }

    /**
     * @return array{
     *     event: Event,
     *     isBookmarked: bool,
     *     registrationStatus: ?string,
     *     registrationToken: ?string,
     *     user: User|null
     * }
     */
    private function showData(string $slug): array
    {
        $event = Event::where('slug', $slug)
            ->with(['organization', 'categories'])
            ->firstOrFail();

        $isBookmarked = false;
        $registrationStatus = null;
        $registrationToken = null;
        $user = Auth::user();

        if ($user) {
            $isBookmarked = Bookmark::where('user_id', $user->id)
                ->where('event_id', $event->id)
                ->exists();

            $registration = Registration::where('user_id', $user->id)
                ->where('event_id', $event->id)
                ->first();

            $registrationStatus = $registration?->status;
            $registrationToken = $registration?->token;
        }

        return [
            'event' => $event,
            'isBookmarked' => $isBookmarked,
            'registrationStatus' => $registrationStatus,
            'registrationToken' => $registrationToken,
            'user' => $user,
        ];
    }
}
