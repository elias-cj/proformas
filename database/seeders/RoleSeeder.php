<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Role::firstOrCreate(['name' => 'Administrador']);
        \App\Models\Role::firstOrCreate(['name' => 'Operador']);
        \App\Models\Role::firstOrCreate(['name' => 'Técnico']);
    }
}
