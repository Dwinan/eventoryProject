<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RegistrationController extends Controller
{
    public function store(Request $request, Event $event)
    {
        if ($event->status !== 'published') {
            return back()->withErrors(['message' => 'Event belum dipublikasikan.']);
        }

        if ($event->quota !== null) {
            $confirmedCount = Registration::where('event_id', $event->id)
                ->where('status', 'confirmed')
                ->count();

            if ($confirmedCount >= $event->quota) {
                return back()->withErrors(['message' => 'Kuota pendaftaran sudah penuh.']);
            }
        }

        Registration::updateOrCreate(
            [
                'event_id' => $event->id,
                'user_id' => $request->user()->id,
            ],
            [
                'status' => 'confirmed',
                'token' => (string) Str::uuid(),
            ]
        );

        return back();
    }

    public function destroy(Request $request, Event $event)
    {
        Registration::where('event_id', $event->id)
            ->where('user_id', $request->user()->id)
            ->update(['status' => 'cancelled']);

        return back();
    }
}
