<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PresenceController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $organization = $request->user()->organization;

        if (! $organization) {
            return redirect()->route('dashboard');
        }

        $events = $organization->events()
            ->where('status', 'published')
            ->orderBy('start_at', 'desc')
            ->get(['id', 'title', 'start_at']);

        return Inertia::render('organizer/presence/scan', [
            'events' => $events,
        ]);
    }

    public function verify(Request $request): JsonResponse
    {
        $organization = $request->user()->organization;

        if (! $organization) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $validated = $request->validate([
            'token' => 'required|string',
            'event_id' => 'nullable|exists:events,id',
        ]);

        $query = Registration::where('token', $validated['token'])
            ->whereHas('event', function ($q) use ($organization, $validated) {
                $q->where('organization_id', $organization->id);
                if (! empty($validated['event_id'])) {
                    $q->where('id', $validated['event_id']);
                }
            })
            ->with(['user:id,name,npm', 'event:id,title']);

        $registration = $query->first();

        if (! $registration) {
            return response()->json(['message' => 'Token tidak ditemukan atau bukan kegiatan organisasi Anda.'], 404);
        }

        if ($registration->attended_at !== null) {
            return response()->json([
                'message' => 'Peserta sudah tercatat hadir.',
                'registration' => $registration,
            ], 409);
        }

        $registration->update([
            'status' => 'confirmed',
            'attended_at' => now(),
        ]);

        return response()->json([
            'message' => 'Presensi berhasil dikonfirmasi.',
            'registration' => $registration->fresh(),
        ]);
    }

    public function scan(Request $request, Registration $registration): JsonResponse
    {
        $validated = $request->validate([
            'token' => 'required|string',
        ]);

        if ($registration->token !== $validated['token']) {
            return response()->json(['message' => 'Token tidak valid'], 422);
        }

        if ($registration->attended_at !== null) {
            return response()->json(['message' => 'Peserta sudah hadir'], 409);
        }

        $registration->update([
            'status' => 'confirmed',
            'attended_at' => now(),
        ]);

        return response()->json(['status' => 'confirmed', 'attended_at' => $registration->fresh()->attended_at]);
    }
}
