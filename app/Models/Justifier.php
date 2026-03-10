<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Justifier extends Model
{
    use HasFactory;

    protected $fillable = ['work_order_id', 'file_path', 'file_type', 'description', 'uploaded_by'];

    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
