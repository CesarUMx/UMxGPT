<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    use HasFactory;

    // Especifica el nombre de la tabla si no sigue la convención de nombres de Laravel
    protected $table = 'Actividades';

    // Define los campos que se pueden llenar masivamente
    protected $fillable = ['nombre', 'idSector'];

    // Deshabilita los timestamps si no los usas
    public $timestamps = false;

}
