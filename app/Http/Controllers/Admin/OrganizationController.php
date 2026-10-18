<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    public function index(): Response
    {
        $organizations = Organization::with('user')->withCount('events')->latest()->get();

        return Inertia::render('admin/organizations/index', [
            'organizations' => $organizations,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/organizations/form', [
            'organization' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:ukm,bem,hmj',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'email' => 'required|email|unique:users,email',
        ]);

        $user = User::factory()->create([
            'role' => 'organizer',
            'email' => $validated['email'],
            'name' => $validated['name'],
        ]);

        $organization = Organization::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'type' => $validated['type'],
            'description' => $validated['description'] ?? null,
            'logo' => $validated['logo'] ?? null,
            'is_active' => false,
        ]);

        return redirect()->route('admin.organizations.index')
            ->with('success', "Organisasi {$organization->name} berhasil dibuat.");
    }

    public function show(Organization $organization): RedirectResponse
    {
        return redirect()->route('admin.organizations.edit', $organization->id);
    }

    public function edit(Organization $organization): Response
    {
        $organization->load('user');

        return Inertia::render('admin/organizations/form', [
            'organization' => $organization,
        ]);
    }

    public function update(Request $request, Organization $organization): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
        ]);

        $organization->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'logo' => $validated['logo'] ?? null,
        ]);

        $organization->user->update(['name' => $validated['name']]);

        return redirect()->route('admin.organizations.edit', $organization->id)
            ->with('success', 'Organisasi berhasil diperbarui.');
    }

    public function destroy(Organization $organization): RedirectResponse
    {
        $organization->user->delete();
        $organization->delete();

        return redirect()->route('admin.organizations.index')
            ->with('success', 'Organisasi berhasil dihapus.');
    }

    public function toggle(Request $request, Organization $organization): RedirectResponse
    {
        $organization->update(['is_active' => ! $organization->is_active]);

        return back()->with('success', $organization->is_active ? 'Organisasi diaktifkan.' : 'Organisasi dinonaktifkan.');
    }
}
