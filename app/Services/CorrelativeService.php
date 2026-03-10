<?php

namespace App\Services;

use App\Models\Correlative;
use Illuminate\Support\Facades\DB;
use Exception;

class CorrelativeService
{
    /**
     * Get the next correlative number for a given type, safely using lockForUpdate.
     */
    public function getNextCorrelative(string $type): string
    {
        return DB::transaction(function () use ($type) {
            $correlative = Correlative::where('type', $type)->lockForUpdate()->first();

            if (!$correlative) {
                throw new Exception("El tipo de correlativo '{$type}' no está configurado.");
            }

            $correlative->last_number += 1;
            $correlative->save();

            $numberPadded = str_pad($correlative->last_number, 6, '0', STR_PAD_LEFT);
            return $correlative->prefix ? "{$correlative->prefix}-{$numberPadded}" : $numberPadded;
        });
    }
}
