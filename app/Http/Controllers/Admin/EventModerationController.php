<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventModerationController extends Controller
{
    public function takeDown(Request $request, Event $event)
    {
        $event->update([
            'status' => 'draft',
            'moderated_by' => $request->user()->id,
            'moderated_at' => now(),
        ]);

        return back()->with('success', 'Event ditandai sebagai draft.');
    }

    public function restore(Request $request, Event $event)
    {
        $event->update([
            'status' => 'published',
            'moderated_by' => $request->user()->id,
            'moderated_at' => now(),
        ]);

        return back()->with('success', 'Event dikembalikan sebagai published.');
    }
}
