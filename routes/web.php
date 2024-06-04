<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FamiliaController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\ActividadController;

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
Route::post('/chatGPT', [ChatGPTController::class, 'chatGPT']);
Route::get('/competencia/{perfilId}', [CompetenciaController::class, 'getCompetencias']);
Route::post('/guardar-competencia', [CompetenciaController::class, 'guardarCompetencia']);
Route::post('/descripcion', [CompetenciaController::class, 'traerDescripcion']);
Route::post('/guardar-descripcion', [CompetenciaController::class, 'guardarDescripcion']);