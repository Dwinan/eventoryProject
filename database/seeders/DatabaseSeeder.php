<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        User::factory()->create([
            'role' => 'administrator',
            'name' => 'Admin Eventory',
            'email' => 'admin@eventory.test',
        ]);

        User::factory()->count(10)->create([
            'role' => 'general',
        ]);

        // Urut sesuai dependency: ormawa -> kategori -> event -> registrasi -> bookmark
        $this->call([
            OrganizationSeeder::class,
            CategorySeeder::class,
            EventSeeder::class,
            RegistrationSeeder::class,
            BookmarkSeeder::class,
        ]);
    }
}
