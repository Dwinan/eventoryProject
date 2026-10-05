<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Organization;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'organizer') {
            $organization = $user->organization;

            if (! $organization) {
                return Inertia::render('Dashboard', [
                    'role' => 'organizer',
                    'organization' => null,
                    'events' => [],
                    'stats' => ['total_events' => 0, 'total_registrations' => 0],
                ]);
            }

            $events = Event::where('organization_id', $organization->id)
                ->withCount('registrations')
                ->latest()
                ->get();

            $stats = [
                'total_events' => $events->count(),
                'total_registrations' => $events->sum('registrations_count'),
            ];

            return Inertia::render('Dashboard', [
                'role' => 'organizer',
                'organization' => $organization,
                'events' => $events,
                'stats' => $stats,
            ]);
        }

        if ($user->role === 'administrator') {
            return Inertia::render('Dashboard', [
                'role' => 'administrator',
                'stats' => [
                    'total_events' => Event::count(),
                    'total_organizations' => Organization::count(),
                    'total_users' => User::count(),
                ],
            ]);
        }

        $registrations = Registration::where('user_id', $user->id)
            ->with(['event.organization'])
            ->latest()
            ->get();

        $bookmarks = $user->bookmarkedEvents()->with('organization')->get();

        return Inertia::render('Dashboard', [
            'role' => 'general',
            'registrations' => $registrations,
            'bookmarks' => $bookmarks,
        ]);
    }
}
