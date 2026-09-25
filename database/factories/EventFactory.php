<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $organization = Organization::where('is_active', true)->inRandomOrder()->first();
        
        $startAt = Carbon::parse(fake()->dateTimeBetween('+1 week', '+3 months'));
        $endAt = (clone $startAt)->modify('+3 hours');
        
        $isPublished = $startAt->isPast() || fake()->boolean(70);
        
        return [
            'organization_id' => $organization?->id ?? null,
            'title' => fake()->sentence(4),
            'slug' => Str::slug(fake()->sentence(3)),
            'description' => fake()->paragraph(),
            'location' => fake()->address(),
            'start_at' => $startAt,
            'end_at' => $endAt,
            'poster' => fake()->randomElement([null, 'storage/posters/' . Str::uuid() . '.jpg']),
            'quota' => fake()->randomElement([null, fake()->numberBetween(20, 200)]),
            'status' => $isPublished ? 'published' : 'draft',
            'published_at' => $isPublished ? $startAt->subWeek() : null,
        ];
    }
}
