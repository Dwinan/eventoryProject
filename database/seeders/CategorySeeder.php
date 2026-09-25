<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{

    use WithoutModelEvents;
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Lomba', 'slug' => 'lomba'],
            ['name' => 'Seminar', 'slug' => 'seminar'],
            ['name' => 'Workshop', 'slug' => 'workshop'],
            ['name' => 'Pameran', 'slug' => 'pameran'],
            ['name' => 'Sosial', 'slug' => 'sosial'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                ['name' => $category['name']]
            );
        }
    }
}
