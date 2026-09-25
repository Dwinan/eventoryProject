<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RegistrationSeeder extends Seeder
{

    use WithoutModelEvents;
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $publishedEvents = Event::where('status', 'published')->limit(20)->get();
        $users = User::where('role', 'general')->limit(10)->get();

        foreach ($users as $user) {
            foreach ($publishedEvents->random(fake()->numberBetween(1, 2)) as $event) {
                Registration::firstOrCreate(
                    ['event_id' => $event->id, 'user_id' => $user->id],
                    [
                        'status' => 'confirmed',
                        'token' => Str::uuid(),
                        'attended_at' => null,
                    ]
                );
            }
        }
    }
}
