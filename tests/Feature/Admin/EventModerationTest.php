<?php

namespace Tests\Feature\Admin;

use App\Models\Event;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventModerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_take_down_and_restore_event()
    {
        $admin = User::factory()->administrator()->create();
        $organization = Organization::factory()->create();

        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'status' => 'published',
            'moderated_by' => null,
            'moderated_at' => null,
        ]);

        // Take down
        $takeDownResponse = $this->actingAs($admin)->post(route('admin.events.take-down', $event->id));
        $takeDownResponse->assertRedirect();

        $freshEvent = $event->fresh();
        $this->assertEquals('draft', $freshEvent->status);
        $this->assertEquals($admin->id, $freshEvent->moderated_by);
        $this->assertNotNull($freshEvent->moderated_at);

        // Restore
        $restoreResponse = $this->actingAs($admin)->post(route('admin.events.restore', $event->id));
        $restoreResponse->assertRedirect();

        $restoredEvent = $event->fresh();
        $this->assertEquals('published', $restoredEvent->status);
        $this->assertEquals($admin->id, $restoredEvent->moderated_by);
    }

    public function test_non_admin_cannot_take_down_event()
    {
        $generalUser = User::factory()->general()->create();
        $organization = Organization::factory()->create();

        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'status' => 'published',
        ]);

        $this->actingAs($generalUser)
            ->post(route('admin.events.take-down', $event->id))
            ->assertForbidden();

        $this->actingAs($organization->user)
            ->post(route('admin.events.take-down', $event->id))
            ->assertForbidden();

        $this->assertEquals('published', $event->fresh()->status);
    }
}
