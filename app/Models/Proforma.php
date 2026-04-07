<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proforma extends Model
{
    use HasFactory;

    protected $fillable = [
        'number', 'customer_id', 'date', 'validity_days', 
        'status', 'subtotal', 'discount', 'total', 'template_id'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function details()
    {
        return $this->hasMany(ProformaDetail::class);
    }

    public function workOrder()
    {
        return $this->hasOne(WorkOrder::class);
    }

    /**
     * Get the total amount in Spanish words.
     */
    public function getTotalInWordsAttribute()
    {
        $num = $this->total;
        if (!$num || $num == 0) return "SON: CERO CON 00/100 BOLIVIANOS";
        
        $unidades = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
        $decenas = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
        $especiales = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
        $centenas = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

        $convertirSeccion = function($n) use ($unidades, $decenas, $especiales, $centenas) {
            $output = "";
            if ($n == 100) return "CIEN ";
            if ($n > 99) {
                $output .= $centenas[(int)($n / 100)] . " ";
                $n %= 100;
            }
            if ($n >= 10 && $n <= 19) {
                $output .= $especiales[$n - 10] . " ";
            } else {
                if ($n >= 20) {
                    $output .= $decenas[(int)($n / 10)] . ($n % 10 !== 0 ? " Y " : " ");
                    $n %= 10;
                }
                $output .= $unidades[$n] . " ";
            }
            return $output;
        };

        $entero = (int)$num;
        $decimales = round(($num - $entero) * 100);
        $letras = "";

        if ($entero == 0) {
            $letras = "CERO";
        } else {
            if ($entero >= 1000) {
                $miles = (int)($entero / 1000);
                $letras .= ($miles == 1 ? "UN " : $convertirSeccion($miles)) . "MIL ";
                $entero %= 1000;
            }
            $letras .= $convertirSeccion($entero);
        }

        return "SON: " . trim($letras) . " CON " . str_pad($decimales, 2, '0', STR_PAD_LEFT) . "/100 BOLIVIANOS";
    }
}
