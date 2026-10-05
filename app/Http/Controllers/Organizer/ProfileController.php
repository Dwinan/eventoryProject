<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $organization = $request->user()->organization;

        if (! $organization) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Organizer/Profile', [
            'organization' => $organization->load('user'),
        ]);
    }

    public function update(Request $request)
    {
        $organization = $request->user()->organization;

        if (! $organization) {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
        ]);

        $organization->update($validated);

        return redirect()->route('organizer.profile.show')
            ->with('success', 'Profil berhasil diperbarui.');
    }
}
