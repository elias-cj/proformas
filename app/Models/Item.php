<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'type', 'unit', 
        'price', 'stock', 'brand', 'description', 
        'category_id', 'is_active'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
