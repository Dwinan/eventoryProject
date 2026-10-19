<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Organization;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_register_for_published_event()
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->general()->create();
        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'status' => 'published',
            'quota' => 50,
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(5)->addHours(2),
        ]);

        $response = $this->actingAs($user)->post(route('events.register', $event->id));
        $response->assertRedirect();

        $this->assertDatabaseHas('registrations', [
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => 'confirmed',
        ]);

        $reg = Registration::where('event_id', $event->id)->where('user_id', $user->id)->first();
        $this->assertNotNull($reg->token);
    }

    public function test_user_cannot_register_when_quota_is_full()
    {
        $organization = Organization::factory()->create();
        $user1 = User::factory()->general()->create();
        $user2 = User::factory()->general()->create();

        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'status' => 'published',
            'quota' => 1, // Only 1 slot
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(5)->addHours(2),
        ]);

        // User 1 registers
        $this->actingAs($user1)->post(route('events.register', $event->id));
        $this->assertDatabaseHas('registrations', [
            'event_id' => $event->id,
            'user_id' => $user1->id,
            'status' => 'confirmed',
        ]);

        // User 2 tries to register
        $response = $this->actingAs($user2)->post(route('events.register', $event->id));
        $response->assertSessionHasErrors(['message' => 'Kuota pendaftaran sudah penuh.']);

        $this->assertDatabaseMissing('registrations', [
            'event_id' => $event->id,
            'user_id' => $user2->id,
        ]);
    }

    public function test_user_cannot_register_for_draft_event()
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->general()->create();
        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'status' => 'draft',
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(5)->addHours(2),
        ]);

        $response = $this->actingAs($user)->post(route('events.register', $event->id));
        $response->assertSessionHasErrors(['message' => 'Event belum dipublikasikan.']);

        $this->assertDatabaseMissing('registrations', [
            'event_id' => $event->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_cancel_registration()
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->general()->create();
        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'status' => 'published',
            'quota' => 10,
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(5)->addHours(2),
        ]);

        // Register first
        $this->actingAs($user)->post(route('events.register', $event->id));

        // Then cancel
        $response = $this->actingAs($user)->post(route('events.cancel', $event->id));
        $response->assertRedirect();

        $this->assertDatabaseHas('registrations', [
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_cancelled_user_can_re_register()
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->general()->create();
        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'status' => 'published',
            'quota' => 10,
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(5)->addHours(2),
        ]);

        // Register and cancel
        $this->actingAs($user)->post(route('events.register', $event->id));
        $initialReg = Registration::where('event_id', $event->id)->where('user_id', $user->id)->first();
        $oldToken = $initialReg->token;

        $this->actingAs($user)->post(route('events.cancel', $event->id));

        // Re-register
        $this->actingAs($user)->post(route('events.register', $event->id));

        $updatedReg = Registration::where('event_id', $event->id)->where('user_id', $user->id)->first();
        $this->assertEquals('confirmed', $updatedReg->status);
        $this->assertNotEquals($oldToken, $updatedReg->token); // New token generated
    }

    public function test_guest_cannot_register_or_cancel()
    {
        $organization = Organization::factory()->create();
        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'status' => 'published',
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(5)->addHours(2),
        ]);

        $this->post(route('events.register', $event->id))->assertRedirect(route('login'));
        $this->post(route('events.cancel', $event->id))->assertRedirect(route('login'));
    }
}
