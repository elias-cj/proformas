<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proforma_id')->constrained()->onDelete('restrict');
            $table->decimal('amount', 10, 2);
            $table->string('payment_method'); // efectivo, transferencia, tarjeta
            $table->string('reference_number')->nullable();
            $table->foreignId('cash_movement_id')->nullable()->constrained()->onDelete('set null'); // Optional link to cash
            $table->foreignId('user_id')->constrained()->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
