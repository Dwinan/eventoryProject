<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Organization;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EdgeCasesAndSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_draft_event_is_not_viewable_by_guest_or_regular_student()
    {
        $organization = Organization::factory()->create();
        $student = User::factory()->general()->create();

        $draftEvent = Event::factory()->create([
            'organization_id' => $organization->id,
            'slug' => 'rahasia-draft-kegiatan',
            'status' => 'draft',
        ]);

        // Guest gets 404
        $this->get(route('events.show', 'rahasia-draft-kegiatan'))->assertNotFound();

        // Student gets 404
        $this->actingAs($student)
            ->get(route('events.show', 'rahasia-draft-kegiatan'))
            ->assertNotFound();

        // Owner organizer can view
        $this->actingAs($organization->user)
            ->get(route('events.show', 'rahasia-draft-kegiatan'))
            ->assertOk();

        // Administrator can view
        $admin = User::factory()->administrator()->create();
        $this->actingAs($admin)
            ->get(route('events.show', 'rahasia-draft-kegiatan'))
            ->assertOk();
    }

    public function test_organizer_cannot_scan_registration_belonging_to_another_organization_idor()
    {
        $orgA = Organization::factory()->create();
        $orgB = Organization::factory()->create();
        $student = User::factory()->general()->create();

        $eventB = Event::factory()->create([
            'organization_id' => $orgB->id,
            'status' => 'published',
        ]);

        $regB = Registration::create([
            'event_id' => $eventB->id,
            'user_id' => $student->id,
            'status' => 'confirmed',
            'token' => 'token-milik-org-b',
        ]);

        // Org A tries to scan registration B with correct token -> MUST BE 403 Forbidden
        $response = $this->actingAs($orgA->user)
            ->postJson(route('organizer.registrations.scan', $regB->id), [
                'token' => 'token-milik-org-b',
            ]);

        $response->assertForbidden();
    }

    public function test_event_creation_handles_emojis_and_special_characters()
    {
        $organization = Organization::factory()->create();

        $payload = [
            'title' => 'Festival Musik Kampus 🎸✨ 🎉',
            'slug' => 'festival-musik-kampus-2026',
            'description' => "Deskripsi acara dengan simbol & ampersand <script>alert('xss')</script> dan multi-baris emoji 🚀💡",
            'location' => 'Lapangan Rektorat Unila 📍',
            'start_at' => now()->addDays(14)->format('Y-m-d H:i:s'),
            'end_at' => now()->addDays(14)->addHours(8)->format('Y-m-d H:i:s'),
            'quota' => 500,
            'status' => 'published',
        ];

        $response = $this->actingAs($organization->user)
            ->post(route('organizer.events.store'), $payload);

        $response->assertRedirect();

        $this->assertDatabaseHas('events', [
            'slug' => 'festival-musik-kampus-2026',
            'title' => 'Festival Musik Kampus 🎸✨ 🎉',
        ]);
    }
}
