<?php

namespace Tests\Feature;

use App\Models\Bookmark;
use App\Models\Event;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventBookmarkTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_bookmark_and_unbookmark_event()
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->general()->create();
        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'status' => 'published',
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(5)->addHours(2),
        ]);

        // Bookmark
        $response = $this->actingAs($user)->post(route('events.bookmark', $event->id));
        $response->assertRedirect();

        $this->assertDatabaseHas('bookmarks', [
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);

        // Duplicate bookmark is idempotent
        $this->actingAs($user)->post(route('events.bookmark', $event->id));
        $this->assertEquals(1, Bookmark::where('user_id', $user->id)->where('event_id', $event->id)->count());

        // Unbookmark
        $deleteResponse = $this->actingAs($user)->delete(route('events.unbookmark', $event->id));
        $deleteResponse->assertRedirect();

        $this->assertDatabaseMissing('bookmarks', [
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
    }

    public function test_guest_cannot_bookmark()
    {
        $organization = Organization::factory()->create();
        $event = Event::factory()->create(['organization_id' => $organization->id]);

        $this->post(route('events.bookmark', $event->id))->assertRedirect(route('login'));
        $this->delete(route('events.unbookmark', $event->id))->assertRedirect(route('login'));
    }
}
