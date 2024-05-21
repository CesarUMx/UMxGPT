<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Familia extends Model
{
    use HasFactory;
    protected $table = 'Familia';

    protected $fillable = ['nombre'];

    public $timestamps = false;
}
