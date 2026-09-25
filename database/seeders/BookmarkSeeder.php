<?php

namespace Database\Seeders;

use App\Models\Bookmark;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookmarkSeeder extends Seeder
{

    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'general')->limit(15)->get();
        $events = Event::where('status', 'published')->limit(20)->get();

        foreach ($users as $user) {
            foreach ($events->random(fake()->numberBetween(1, 3)) as $event) {
                Bookmark::firstOrCreate([
                    'user_id' => $user->id,
                    'event_id' => $event->id,
                ]);
            }
        }
    }
}
