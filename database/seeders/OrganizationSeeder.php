<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrganizationSeeder extends Seeder
{

    use WithoutModelEvents;
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizations = [
            ['name' => 'BEM UGM', 'type' => 'bem', 'email' => 'bem@eventory.test'],
            ['name' => 'HMJ Teknik Informatika', 'type' => 'hmj', 'email' => 'hmi@eventory.test'],
            ['name' => 'UKM Musik', 'type' => 'ukm', 'email' => 'ukm-musik@eventory.test'],
            ['name' => 'UKM Olahraga', 'type' => 'ukm', 'email' => 'ukm-olahraga@eventory.test'],
            ['name' => 'HMJ Manajemen', 'type' => 'hmj', 'email' => 'hmj-manajemen@eventory.test'],
        ];

        foreach ($organizations as $org) {
            $user = User::factory()->create([
                'role' => 'organizer',
                'email' => $org['email'],
            ]);

            Organization::create([
                'user_id' => $user->id,
                'name' => $org['name'],
                'slug' => Str::slug($org['name']),
                'type' => $org['type'],
                'description' => fake()->paragraph(),
                'is_active' => true,
            ]);
        }
    }
}
