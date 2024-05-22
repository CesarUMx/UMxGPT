<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Perfil extends Model
{
    use HasFactory;

    // Especifica el nombre de la tabla si no sigue la convención de nombres de Laravel
    protected $table = 'Perfiles';

    // Define los campos que se pueden llenar masivamente
    protected $fillable = ['nombre', 'idActividad'];

    // Deshabilita los timestamps si no los usas
    public $timestamps = false;
}
