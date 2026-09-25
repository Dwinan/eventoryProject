<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{

    use WithoutModelEvents;
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Event::factory()->count(20)->create();

        foreach (Event::all() as $event) {
            $event->categories()->sync(
                Category::inRandomOrder()
                    ->limit(fake()->numberBetween(1, 2))
                    ->pluck('id')
            );
        }
    }
}
