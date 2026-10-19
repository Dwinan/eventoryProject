<?php

namespace Tests\Feature\Organizer;

use App\Models\Event;
use App\Models\Organization;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PresenceScannerTest extends TestCase
{
    use RefreshDatabase;

    public function test_organizer_can_verify_valid_token_and_record_attendance()
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->general()->create();

        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'status' => 'published',
        ]);

        $registration = Registration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => 'confirmed',
            'token' => 'qr-token-valid-1234',
        ]);

        $response = $this->actingAs($organization->user)
            ->postJson(route('organizer.presence.verify'), [
                'token' => 'qr-token-valid-1234',
                'event_id' => $event->id,
            ]);

        $response->assertOk()
            ->assertJsonPath('message', 'Presensi berhasil dikonfirmasi.');

        $this->assertNotNull($registration->fresh()->attended_at);
    }

    public function test_cannot_re_verify_already_attended_token()
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->general()->create();

        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'status' => 'published',
        ]);

        $registration = Registration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => 'confirmed',
            'token' => 'qr-token-attended',
            'attended_at' => now()->subHour(),
        ]);

        $response = $this->actingAs($organization->user)
            ->postJson(route('organizer.presence.verify'), [
                'token' => 'qr-token-attended',
            ]);

        $response->assertStatus(409)
            ->assertJsonPath('message', 'Peserta sudah tercatat hadir.');
    }

    public function test_verify_non_existent_token_returns_404()
    {
        $organization = Organization::factory()->create();

        $response = $this->actingAs($organization->user)
            ->postJson(route('organizer.presence.verify'), [
                'token' => 'token-palsu-ngawur',
            ]);

        $response->assertNotFound();
    }

    public function test_organizer_cannot_verify_token_from_another_organization()
    {
        $orgA = Organization::factory()->create();
        $orgB = Organization::factory()->create();
        $user = User::factory()->general()->create();

        // Event milik Org B
        $eventB = Event::factory()->create([
            'organization_id' => $orgB->id,
            'status' => 'published',
        ]);

        Registration::create([
            'event_id' => $eventB->id,
            'user_id' => $user->id,
            'status' => 'confirmed',
            'token' => 'org-b-secret-token',
        ]);

        // Org A mencoba verifikasi token Org B
        $response = $this->actingAs($orgA->user)
            ->postJson(route('organizer.presence.verify'), [
                'token' => 'org-b-secret-token',
            ]);

        $response->assertNotFound();
    }

    public function test_scan_endpoint_verifies_registration()
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->general()->create();

        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'status' => 'published',
        ]);

        $registration = Registration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => 'confirmed',
            'token' => 'scan-token-111',
        ]);

        // Wrong token -> 422
        $this->actingAs($organization->user)
            ->postJson(route('organizer.registrations.scan', $registration->id), [
                'token' => 'wrong-token',
            ])
            ->assertStatus(422);

        // Correct token -> 200
        $this->actingAs($organization->user)
            ->postJson(route('organizer.registrations.scan', $registration->id), [
                'token' => 'scan-token-111',
            ])
            ->assertOk()
            ->assertJsonPath('status', 'confirmed');

        $this->assertNotNull($registration->fresh()->attended_at);

        // Re-scan -> 409
        $this->actingAs($organization->user)
            ->postJson(route('organizer.registrations.scan', $registration->id), [
                'token' => 'scan-token-111',
            ])
            ->assertStatus(409);
    }
}
