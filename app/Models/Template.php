<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'file_path', 'is_active'];

    protected static function booted()
    {
        static::saving(function ($template) {
            if ($template->is_active) {
                static::where('id', '!=', $template->id)->update(['is_active' => false]);
            }
        });
    }
}
