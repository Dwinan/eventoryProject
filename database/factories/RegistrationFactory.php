<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Registration>
 */
class RegistrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Pastikan event yang dipilih adalah published agar bisa didaftar
        $event = Event::where('status', 'published')->inRandomOrder()->first();
        
        // Pastikan user yang dipilih adalah general
        $user = User::where('role', 'general')->inRandomOrder()->first();
        
        return [
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => 'confirmed', // langsung confirmed untuk seeder
            'token' => Str::uuid(),
            'attended_at' => null, // akan diisi oleh presence seeder
        ];
    }
}
