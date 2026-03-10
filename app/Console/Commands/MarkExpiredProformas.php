<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MarkExpiredProformas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'proformas:mark-vencidas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Revisa todas las proformas en estado borrador o enviada y, si han superado sus días de validez según la fecha de emisión, las marca como vencidas.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando verificación de proformas vencidas...');

        $proformas = \App\Models\Proforma::whereIn('status', ['borrador', 'enviada'])->get();
        $count = 0;

        foreach ($proformas as $proforma) {
            $expirationDate = \Carbon\Carbon::parse($proforma->date)->addDays($proforma->validity_days);
            
            if (now()->startOfDay()->greaterThan($expirationDate)) {
                $proforma->update(['status' => 'vencida']);
                $count++;
            }
        }

        $this->info("Proceso terminado. Se marcaron {$count} proformas como vencidas.");
    }
}
