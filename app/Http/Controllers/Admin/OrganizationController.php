<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function index()
    {
        $organizations = Organization::with('user')->latest()->get();

        return Inertia::render('Admin/Organizations', [
            'organizations' => $organizations,
        ]);
    }

    public function store(Request $request)
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

    public function show(Organization $organization)
    {
        $organization->load('user', 'events');

        return Inertia::render('Admin/OrganizationDetail', [
            'organization' => $organization,
        ]);
    }

    public function edit(Organization $organization)
    {
        $organization->load('user');

        return Inertia::render('Admin/OrganizationForm', [
            'organization' => $organization,
        ]);
    }

    public function update(Request $request, Organization $organization)
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

    public function destroy(Organization $organization)
    {
        $organization->user->delete();
        $organization->delete();

        return redirect()->route('admin.organizations.index')
            ->with('success', 'Organisasi berhasil dihapus.');
    }

    public function toggle(Request $request, Organization $organization)
    {
        $organization->update(['is_active' => ! $organization->is_active]);

        return back()->with('success', $organization->is_active ? 'Organisasi diaktifkan.' : 'Organisasi dinonaktifkan.');
    }
}
