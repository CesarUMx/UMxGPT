<?php

namespace App\Http\Controllers;
use App\Models\Conductas;

use Illuminate\Http\Request;

class ConductasController extends Controller
{
    //get all conductas from id competence
    public function getConductas($idCompetencia){
        
        $conductas = Conductas::where('idCompetencia', $idCompetencia)->get();        

        return response()->json([
            'success' => true,
            'data' => $conductas,
        ]);
    }

    //guardar conducta validando que el id de la competencia exista, y que el nombre no sea nulo
    public function guardarConducta(Request $request){

        $messages = [
            'nombre.required' => 'El nombre de la conducta es requerido.',
            'nombre.max' => 'El nombre de la conducta no debe exceder los 255 caracteres.',
            'nombre.regex' => 'El nombre de la conducta debe contener solo letras y espacios.',
            'nombre.string' => 'El nombre de la conducta debe ser una cadena de texto.',
        ];

        try {
            $request->validate([
                'nombre' => 'required|string|max:255|regex:/^[a-zA-Z\s\/]*$/',
                'id_competencia' => 'required|exists:Competencias,id'
            ], $messages);
        $conducta = new Conductas();
        $conducta->nombre = $request->nombre;
        $conducta->idCompetencia = $request->id_competencia;
        $conducta->save();
        return response()->json(['success' => true,'message' => 'Conducta creada', 'id' => $conducta->id]);
        } catch (ValidationException $e) {
            
            if (array_has($e->errors(), 'nombre.required')) {
                return response()->json(['success' => false,'message' => $e->errors()['nombre'][0]]);
            }
            if (array_has($e->errors(), 'nombre.regex:')) {
                return response()->json(['success' => false,'message' => $e->errors()['nombre'][2]]);
            }
            if (array_has($e->errors(), 'nombre.max')) {
                return response()->json(['success' => false,'message' => $e->errors()['nombre'][1]]);
            }
            if (array_has($e->errors(), 'nombre.string')) {
                return response()->json(['success' => false,'message' => $e->errors()['nombre'][3]]);
            }
            if (array_has($e->errors(), 'IdCompetencia.exists')) {
                return response()->json(['success' => false,'message' => $e->errors()['IdCompetencia'][0]]);
            }
        }
    }

    //guardar niveles validando que los niveles no sean nulos y que pertenescan a una id de conducta
    public function guardarNiveles(Request $request){
        $messages = [
            'nivelExperto.required' => 'El nivel experto es requerido.',
            'nivelAvanzado.required' => 'El nivel avanzado es requerido.',
            'nivelIntermedio.required' => 'El nivel intermedio es requerido.',
            'nivelBasico.required' => 'El nivel básico es requerido.',
            'nivelExperto.string' => 'El nivel experto debe ser una cadena de texto.',
            'nivelAvanzado.string' => 'El nivel avanzado debe ser una cadena de texto.',
            'nivelIntermedio.string' => 'El nivel intermedio debe ser una cadena de texto.',
            'nivelBasico.string' => 'El nivel básico debe ser una cadena de texto.',
        ];

        try {
            $request->validate([
                'nivelExperto' => 'required|string',
                'nivelAvanzado' => 'required|string',
                'nivelIntermedio' => 'required|string',
                'nivelBasico' => 'required|string',
            ], $messages);
        
        $conducta = Conductas::find($request->id);
        $conducta->nivelExperto = $request->nivelExperto;
        $conducta->nivelAvanzado = $request->nivelAvanzado;
        $conducta->nivelIntermedio = $request->nivelIntermedio;
        $conducta->nivelBasico = $request->nivelBasico;
        $conducta->save();
        return response()->json(['success' => true,'message' => 'Niveles de la conducta agregados', 'id' => $conducta->id]);
        } catch (ValidationException $e) {
            
            if (array_has($e->errors(), 'nivelExperto.required')) {
                return response()->json(['success' => false,'message' => $e->errors()['nivelExperto'][0]]);
            }
            if (array_has($e->errors(), 'nivelAvanzado.required')) {
                return response()->json(['success' => false,'message' => $e->errors()['nivelAvanzado'][0]]);
            }
            if (array_has($e->errors(), 'nivelIntermedio.required')) {
                return response()->json(['success' => false,'message' => $e->errors()['nivelIntermedio'][0]]);
            }
            if (array_has($e->errors(), 'nivelBasico.required')) {
                return response()->json(['success' => false,'message' => $e->errors()['nivelBasico'][0]]);
            }
            if (array_has($e->errors(), 'nivelExperto.string')) {
                return response()->json(['success' => false,'message' => $e->errors()['nivelExperto'][1]]);
            }
            if (array_has($e->errors(), 'nivelAvanzado.string')) {
                return response()->json(['success' => false,'message' => $e->errors()['nivelAvanzado'][1]]);
            }
            if (array_has($e->errors(), 'nivelIntermedio.string')) {
                return response()->json(['success' => false,'message' => $e->errors()['nivelIntermedio'][1]]);
            }
            if (array_has($e->errors(), 'nivelBasico.string')) {
                return response()->json(['success' => false,'message' => $e->errors()['nivelBasico'][1]]);
            }
        }
    }
}
