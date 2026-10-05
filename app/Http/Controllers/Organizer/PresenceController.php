<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    public function scan(Request $request, Registration $registration)
    {
        $validated = $request->validate([
            'token' => 'required|string',
        ]);

        if ($registration->token !== $validated['token']) {
            return response()->json(['message' => 'Token tidak valid'], 422);
        }

        if ($registration->attended_at !== null) {
            return response()->json(['message' => ' sudah hadir'], 409);
        }

        $registration->update([
            'status' => 'confirmed',
            'attended_at' => now(),
        ]);

        return response()->json(['status' => 'confirmed', 'attended_at' => $registration->fresh()->attended_at]);
    }
}
