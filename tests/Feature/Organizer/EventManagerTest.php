<?php

namespace Tests\Feature\Organizer;

use App\Models\Category;
use App\Models\Event;
use App\Models\Organization;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventManagerTest extends TestCase
{
    use RefreshDatabase;

    public function test_organizer_can_create_event_with_valid_data()
    {
        $organization = Organization::factory()->create();
        $category = Category::create(['name' => 'Seminar', 'slug' => 'seminar']);

        $payload = [
            'title' => 'Seminar Nasional Karir',
            'slug' => 'seminar-nasional-karir',
            'description' => 'Panduan membangun karir di era digital.',
            'location' => 'Gedung Serba Guna Unila',
            'start_at' => now()->addDays(7)->format('Y-m-d H:i:s'),
            'end_at' => now()->addDays(7)->addHours(4)->format('Y-m-d H:i:s'),
            'quota' => 150,
            'status' => 'published',
            'categories' => [$category->id],
        ];

        $response = $this->actingAs($organization->user)
            ->post(route('organizer.events.store'), $payload);

        $response->assertRedirect();

        $this->assertDatabaseHas('events', [
            'title' => 'Seminar Nasional Karir',
            'slug' => 'seminar-nasional-karir',
            'organization_id' => $organization->id,
            'status' => 'published',
        ]);

        $createdEvent = Event::where('slug', 'seminar-nasional-karir')->first();
        $this->assertTrue($createdEvent->categories->contains($category->id));
    }

    public function test_create_event_validation_rules()
    {
        $organization = Organization::factory()->create();

        // 1. Missing required fields
        $response = $this->actingAs($organization->user)
            ->post(route('organizer.events.store'), []);

        $response->assertSessionHasErrors(['title', 'slug', 'description', 'location', 'start_at', 'end_at', 'status']);

        // 2. End date before start date
        $badDateResponse = $this->actingAs($organization->user)
            ->post(route('organizer.events.store'), [
                'title' => 'Test',
                'slug' => 'test-slug',
                'description' => 'Test',
                'location' => 'Test',
                'start_at' => now()->addDays(5)->format('Y-m-d H:i:s'),
                'end_at' => now()->addDays(4)->format('Y-m-d H:i:s'), // Earlier than start_at
                'status' => 'draft',
            ]);

        $badDateResponse->assertSessionHasErrors(['end_at']);

        // 3. Negative quota
        $badQuotaResponse = $this->actingAs($organization->user)
            ->post(route('organizer.events.store'), [
                'title' => 'Test',
                'slug' => 'test-slug-quota',
                'description' => 'Test',
                'location' => 'Test',
                'start_at' => now()->addDays(1)->format('Y-m-d H:i:s'),
                'end_at' => now()->addDays(1)->addHours(2)->format('Y-m-d H:i:s'),
                'quota' => -5,
                'status' => 'draft',
            ]);

        $badQuotaResponse->assertSessionHasErrors(['quota']);
    }

    public function test_organizer_cannot_edit_update_or_delete_other_organization_event()
    {
        $orgA = Organization::factory()->create();
        $orgB = Organization::factory()->create();

        $eventB = Event::factory()->create([
            'organization_id' => $orgB->id,
            'title' => 'Event Milik Org B',
        ]);

        // Org A tries to edit Org B's event -> 403 Forbidden
        $this->actingAs($orgA->user)
            ->get(route('organizer.events.edit', $eventB->id))
            ->assertForbidden();

        // Org A tries to update Org B's event -> 403 Forbidden
        $this->actingAs($orgA->user)
            ->put(route('organizer.events.update', $eventB->id), [
                'title' => 'Hacked Title',
                'slug' => 'hacked-title',
                'description' => 'Hacked',
                'location' => 'Hacked',
                'start_at' => now()->addDays(1)->format('Y-m-d H:i:s'),
                'end_at' => now()->addDays(1)->addHours(2)->format('Y-m-d H:i:s'),
                'status' => 'draft',
            ])
            ->assertForbidden();

        $this->assertDatabaseMissing('events', ['title' => 'Hacked Title']);

        // Org A tries to delete Org B's event -> 403 Forbidden
        $this->actingAs($orgA->user)
            ->delete(route('organizer.events.destroy', $eventB->id))
            ->assertForbidden();

        $this->assertDatabaseHas('events', ['id' => $eventB->id]);
    }

    public function test_deleting_event_cascades_registrations_and_bookmarks()
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->general()->create();

        $event = Event::factory()->create(['organization_id' => $organization->id]);

        $user->bookmarkedEvents()->attach($event->id);
        Registration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => 'confirmed',
            'token' => 'token-uuid',
        ]);

        // Organizer deletes event
        $this->actingAs($organization->user)
            ->delete(route('organizer.events.destroy', $event->id))
            ->assertRedirect();

        $this->assertDatabaseMissing('events', ['id' => $event->id]);
        $this->assertDatabaseMissing('registrations', ['event_id' => $event->id]);
        $this->assertDatabaseMissing('bookmarks', ['event_id' => $event->id]);
    }
}
