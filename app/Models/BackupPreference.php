<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BackupPreference extends Model
{
    use HasFactory;

    protected $fillable = ['frequency_days', 'destination'];
}
