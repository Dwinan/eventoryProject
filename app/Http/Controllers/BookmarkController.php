<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Event;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function store(Request $request, Event $event)
    {
        Bookmark::firstOrCreate([
            'user_id' => $request->user()->id,
            'event_id' => $event->id,
        ]);

        return back();
    }

    public function destroy(Request $request, Event $event)
    {
        Bookmark::where('user_id', $request->user()->id)
            ->where('event_id', $event->id)
            ->delete();

        return back();
    }
}
