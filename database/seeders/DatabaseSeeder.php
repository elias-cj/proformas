<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        \App\Models\Company::firstOrCreate(['id' => 1], [
            'name' => 'Mi Empresa',
            'currency' => 'USD'
        ]);

        \App\Models\Appearance::firstOrCreate(['id' => 1], [
            'theme' => 'light'
        ]);

        \App\Models\Correlative::firstOrCreate(['type' => 'proforma'], [
            'prefix' => 'PRF',
            'last_number' => 0
        ]);

        \App\Models\Correlative::firstOrCreate(['type' => 'orden'], [
            'prefix' => 'OT',
            'last_number' => 0
        ]);

        \App\Models\BackupPreference::firstOrCreate(['id' => 1], [
            'frequency_days' => 7
        ]);

        $admin = \App\Models\User::firstOrCreate(['email' => 'admin@admin.com'], [
            'name' => 'Admin User',
            'password' => bcrypt('admin')
        ]);

        $adminRole = \App\Models\Role::where('name', 'Administrador')->first();
        if ($adminRole && !$admin->roles()->where('role_id', $adminRole->id)->exists()) {
            $admin->roles()->attach($adminRole);
        }
    }
}
