<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_type', 'document_number', 'name_reason_social', 
        'email', 'phone', 'address', 'is_active'
    ];
}
