<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RegistrationController extends Controller
{
    public function store(Request $request, Event $event): RedirectResponse
    {
        if ($event->status !== 'published') {
            return back()->withErrors(['message' => 'Event belum dipublikasikan.']);
        }

        $userId = $request->user()->id;

        $registered = DB::transaction(function () use ($event, $userId) {
            $lockedEvent = Event::where('id', $event->id)->lockForUpdate()->first();

            if (! $lockedEvent) {
                return false;
            }

            $existing = Registration::where('event_id', $lockedEvent->id)
                ->where('user_id', $userId)
                ->first();

            if ($existing && $existing->status === 'confirmed') {
                return true;
            }

            if ($lockedEvent->quota !== null) {
                $confirmedCount = Registration::where('event_id', $lockedEvent->id)
                    ->where('status', 'confirmed')
                    ->count();

                if ($confirmedCount >= $lockedEvent->quota) {
                    return false;
                }
            }

            Registration::updateOrCreate(
                [
                    'event_id' => $lockedEvent->id,
                    'user_id' => $userId,
                ],
                [
                    'status' => 'confirmed',
                    'token' => (string) Str::uuid(),
                ]
            );

            return true;
        });

        if (! $registered) {
            return back()->withErrors(['message' => 'Kuota pendaftaran sudah penuh.']);
        }

        return back();
    }

    public function destroy(Request $request, Event $event): RedirectResponse
    {
        Registration::where('event_id', $event->id)
            ->where('user_id', $request->user()->id)
            ->update(['status' => 'cancelled']);

        return back();
    }
}
