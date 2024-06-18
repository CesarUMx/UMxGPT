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
        //crear tabla de conductas con sus respectivos campos de id, id_competencia, nombre y sus niveles de dominio Experto, Avanzado, intermedio y Basico
        Schema::create('Conductas', function (Blueprint $table) {
            $table->id();
            $table->integer('idCompetencia');
            $table->string('nombre', 255);
            $table->string('nivelExperto', 255);
            $table->string('nivelAvanzado', 255);
            $table->string('nivelIntermedio', 255);
            $table->string('nivelBasico', 255);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Conductas');
    }
};
