<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MasterDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_manage_categories()
    {
        $admin = User::factory()->administrator()->create();

        // 1. Create Category
        $response = $this->actingAs($admin)->post(route('admin.categories.store'), [
            'name' => 'Kompetisi Akademik',
        ]);
        $response->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseHas('categories', [
            'name' => 'Kompetisi Akademik',
            'slug' => 'kompetisi-akademik',
        ]);

        $category = Category::where('slug', 'kompetisi-akademik')->first();

        // 2. Duplicate Name validation
        $this->actingAs($admin)->post(route('admin.categories.store'), [
            'name' => 'Kompetisi Akademik',
        ])->assertSessionHasErrors(['name']);

        // 3. Update Category
        $updateResponse = $this->actingAs($admin)->put(route('admin.categories.update', $category->id), [
            'name' => 'Kompetisi Riset & Akademik',
        ]);
        $updateResponse->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Kompetisi Riset & Akademik',
            'slug' => 'kompetisi-riset-akademik',
        ]);

        // 4. Delete Category
        $this->actingAs($admin)->delete(route('admin.categories.destroy', $category->id));
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_admin_can_create_and_toggle_organization()
    {
        $admin = User::factory()->administrator()->create();

        // 1. Create Organization
        $response = $this->actingAs($admin)->post(route('admin.organizations.store'), [
            'name' => 'UKM Robotika Unila',
            'type' => 'ukm',
            'description' => 'Unit kegiatan mahasiswa di bidang robotika dan IoT.',
            'email' => 'robotika@unila.ac.id',
        ]);
        $response->assertRedirect(route('admin.organizations.index'));

        $this->assertDatabaseHas('organizations', [
            'name' => 'UKM Robotika Unila',
            'slug' => 'ukm-robotika-unila',
            'type' => 'ukm',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'robotika@unila.ac.id',
            'role' => 'organizer',
        ]);

        $organization = Organization::where('slug', 'ukm-robotika-unila')->first();

        // 2. Toggle active
        $this->actingAs($admin)->patch(route('admin.organizations.toggle', $organization->id));
        $this->assertTrue($organization->fresh()->is_active);

        $this->actingAs($admin)->patch(route('admin.organizations.toggle', $organization->id));
        $this->assertFalse($organization->fresh()->is_active);
    }

    public function test_admin_can_create_user_and_cannot_delete_self()
    {
        $admin = User::factory()->administrator()->create();

        // 1. Create user
        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@unila.ac.id',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'general',
        ]);
        $response->assertRedirect(route('admin.users.index'));

        $this->assertDatabaseHas('users', [
            'email' => 'budi.santoso@unila.ac.id',
            'role' => 'general',
        ]);

        $newUser = User::where('email', 'budi.santoso@unila.ac.id')->first();
        $this->assertNotNull($newUser->email_verified_at);

        // 2. Delete another user -> OK
        $this->actingAs($admin)->delete(route('admin.users.destroy', $newUser->id))
            ->assertRedirect(route('admin.users.index'));
        $this->assertDatabaseMissing('users', ['id' => $newUser->id]);

        // 3. Self-deletion prevention -> Rejected
        $selfDeleteResponse = $this->actingAs($admin)->delete(route('admin.users.destroy', $admin->id));
        $selfDeleteResponse->assertSessionHas('error', 'Anda tidak dapat menghapus akun sendiri.');
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }
}
