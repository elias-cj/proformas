<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Correlative extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'prefix', 'last_number'];
}
