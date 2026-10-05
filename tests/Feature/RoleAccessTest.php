<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_general_user_cannot_reach_organizer_or_admin_routes()
    {
        $this->actingAs(User::factory()->general()->create());

        $this->get(route('organizer.events.index'))->assertForbidden();
        $this->get(route('admin.users.index'))->assertForbidden();
    }

    public function test_organizer_reaches_own_event_manager()
    {
        $organization = Organization::factory()->create();

        $this->actingAs($organization->user)
            ->get(route('organizer.events.index'))
            ->assertOk();
    }

    public function test_administrator_reaches_admin_routes()
    {
        $this->actingAs(User::factory()->administrator()->create())
            ->get(route('admin.users.index'))
            ->assertOk();
    }

    public function test_administrator_without_organization_is_redirected_from_organizer_routes()
    {
        $this->actingAs(User::factory()->administrator()->create())
            ->get(route('organizer.events.index'))
            ->assertRedirect(route('dashboard'));
    }
}
