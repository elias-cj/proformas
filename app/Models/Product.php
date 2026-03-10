<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'unit', 'price', 'stock', 'is_active'];

    public function services()
    {
        return $this->belongsToMany(Service::class)
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}
