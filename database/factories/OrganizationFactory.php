<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Organization>
 */
class OrganizationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Buat user role organizer terlebih dahulu
        $user = User::factory()->create(['role' => 'organizer']);
        
        $name = fake()->randomElement(['UKM ', 'BEM ', 'HMJ ']) . fake()->words(2, true);
        
        return [
            'user_id' => $user->id,
            'name' => $name,
            'slug' => Str::slug($name),
            'type' => fake()->randomElement(['ukm', 'bem', 'hmj']),
            'description' => fake()->paragraph(),
            'logo' => fake()->randomElement([null, 'storage/logos/' . Str::slug($name) . '.png']),
            'is_active' => true, // default aktif untuk seeder
        ];
    }
}
