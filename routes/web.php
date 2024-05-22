<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FamiliaController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\ActividadController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\ChatGPTController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [FamiliaController::class, 'index']);
Route::post('/guardar-familia', [FamiliaController::class, 'guardarFamilia']);
Route::get('/sector/{familiaId}', [SectorController::class, 'getSectores']);
Route::post('/guardar-sector', [SectorController::class, 'guardarSector']);
Route::get('/actividad/{sectorId}', [ActividadController::class, 'getActividades']);
Route::post('/guardar-actividad', [ActividadController::class, 'guardarActividad']);
Route::get('/perfil/{actividadId}', [PerfilController::class, 'getPerfiles']);
Route::post('/guardar-perfil', [PerfilController::class, 'guardarPerfil']);
Route::get('/chatGPT', [ChatGPTController::class, 'chatGPT']);