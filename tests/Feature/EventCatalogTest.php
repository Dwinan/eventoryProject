<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Event;
use App\Models\Organization;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_view_event_catalog_with_published_events_only()
    {
        $organization = Organization::factory()->create();

        $published = Event::factory()->create([
            'organization_id' => $organization->id,
            'title' => 'Workshop AI Unila',
            'status' => 'published',
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(5)->addHours(3),
        ]);

        $draft = Event::factory()->create([
            'organization_id' => $organization->id,
            'title' => 'Internal Meeting Draft',
            'status' => 'draft',
            'start_at' => now()->addDays(2),
            'end_at' => now()->addDays(2)->addHours(2),
        ]);

        $response = $this->get(route('events.index'));
        $response->assertOk();

        $events = $response->viewData('page')['props']['events']['data'];
        $titles = collect($events)->pluck('title');

        $this->assertTrue($titles->contains('Workshop AI Unila'));
        $this->assertFalse($titles->contains('Internal Meeting Draft'));
    }

    public function test_catalog_filters_by_category_and_search()
    {
        $organization = Organization::factory()->create();
        $techCategory = Category::create(['name' => 'Teknologi', 'slug' => 'teknologi']);
        $artCategory = Category::create(['name' => 'Seni', 'slug' => 'seni']);

        $techEvent = Event::factory()->create([
            'organization_id' => $organization->id,
            'title' => 'Hackathon Mahasiswa',
            'status' => 'published',
            'start_at' => now()->addDays(3),
            'end_at' => now()->addDays(3)->addHours(6),
        ]);
        $techEvent->categories()->attach($techCategory->id);

        $artEvent = Event::factory()->create([
            'organization_id' => $organization->id,
            'title' => 'Pameran Lukisan',
            'status' => 'published',
            'start_at' => now()->addDays(4),
            'end_at' => now()->addDays(4)->addHours(4),
        ]);
        $artEvent->categories()->attach($artCategory->id);

        // Filter by category
        $catResponse = $this->get(route('events.index', ['category' => 'teknologi']));
        $catResponse->assertOk();
        $catData = collect($catResponse->viewData('page')['props']['events']['data'])->pluck('title');
        $this->assertTrue($catData->contains('Hackathon Mahasiswa'));
        $this->assertFalse($catData->contains('Pameran Lukisan'));

        // Search by keyword
        $searchResponse = $this->get(route('events.index', ['search' => 'Hackathon']));
        $searchResponse->assertOk();
        $searchData = collect($searchResponse->viewData('page')['props']['events']['data'])->pluck('title');
        $this->assertTrue($searchData->contains('Hackathon Mahasiswa'));
        $this->assertFalse($searchData->contains('Pameran Lukisan'));
    }

    public function test_public_can_view_published_event_detail()
    {
        $organization = Organization::factory()->create();
        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'slug' => 'seminar-nasional-2026',
            'status' => 'published',
            'start_at' => now()->addDays(7),
            'end_at' => now()->addDays(7)->addHours(4),
        ]);

        $response = $this->get(route('events.show', 'seminar-nasional-2026'));
        $response->assertOk();

        $pageProps = $response->viewData('page')['props'];
        $this->assertEquals($event->id, $pageProps['event']['id']);
        $this->assertFalse($pageProps['isBookmarked']);
        $this->assertNull($pageProps['registrationStatus']);
    }

    public function test_authenticated_user_sees_bookmark_and_registration_status_in_detail()
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->general()->create();

        $event = Event::factory()->create([
            'organization_id' => $organization->id,
            'slug' => 'lomba-debat-2026',
            'status' => 'published',
            'start_at' => now()->addDays(10),
            'end_at' => now()->addDays(10)->addHours(4),
        ]);

        $user->bookmarkedEvents()->attach($event->id);
        Registration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => 'confirmed',
            'token' => 'test-token-uuid-1234',
        ]);

        $response = $this->actingAs($user)->get(route('events.show', 'lomba-debat-2026'));
        $response->assertOk();

        $props = $response->viewData('page')['props'];
        $this->assertTrue($props['isBookmarked']);
        $this->assertEquals('confirmed', $props['registrationStatus']);
        $this->assertEquals('test-token-uuid-1234', $props['registrationToken']);
    }

    public function test_non_existent_event_returns_404()
    {
        $response = $this->get(route('events.show', 'slug-tidak-ada'));
        $response->assertNotFound();
    }
}
