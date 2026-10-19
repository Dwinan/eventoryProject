<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventModerationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Event::with(['organization', 'categories'])->latest('start_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        $events = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/events/index', [
            'events' => $events,
            'filters' => (object) $request->only(['status', 'search']),
        ]);
    }

    public function takeDown(Request $request, Event $event): RedirectResponse
    {
        $event->update([
            'status' => 'draft',
            'moderated_by' => $request->user()->id,
            'moderated_at' => now(),
        ]);

        return back()->with('success', 'Event ditandai sebagai draft.');
    }

    public function restore(Request $request, Event $event): RedirectResponse
    {
        $event->update([
            'status' => 'published',
            'moderated_by' => $request->user()->id,
            'moderated_at' => now(),
        ]);

        return back()->with('success', 'Event dikembalikan sebagai published.');
    }
}
