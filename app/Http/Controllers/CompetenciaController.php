<?php

namespace App\Http\Controllers;
use App\Models\Competencia;

use Illuminate\Http\Request;

class CompetenciaController extends Controller
{
    //get all competences from id profile
    public function getCompetencias($idPerfil){
        
        $competences = Competencia::where('idPerfil', $idPerfil)->get();        

        return response()->json([
            'success' => true,
            'data' => $competences,
            'idPerfil' => $idPerfil
        ]);
    }

    //save competence validating that the name does not exist in the database, that the profile id exists, and that the name is not null
    public function guardarCompetencia(Request $request){

        $messages = [
            'nombre.required' => 'El nombre de la competencia es requerido.',
            'nombre.max' => 'El nombre de la competencia no debe exceder los 255 caracteres.',
            'nombre.regex' => 'El nombre de la competencia debe contener solo letras y espacios.',
            'nombre.string' => 'El nombre de la competencia debe ser una cadena de texto.',
        ];

        try {
            $request->validate([
                'nombre' => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
                'id_perfil' => 'required|exists:Perfiles,id'
            ], $messages);
        $competence = new Competencia();
        $competence->nombre = $request->nombre;
        $competence->idPerfil = $request->id_perfil;
        $competence->save();
        return response()->json(['success' => true,'message' => 'Competencia creada', 'id' => $competence->id]);
        } catch (ValidationException $e) {
            
            if (array_has($e->errors(), 'nombre.required')) {
                return response()->json(['success' => false,'message' => $e->errors()['nombre'][0]]);
            }
            if (array_has($e->errors(), 'nombre.regex:')) {
                return response()->json(['success' => false,'message' => $e->errors()['nombre'][3]]);
            }
            if (array_has($e->errors(), 'nombre.max')) {
                return response()->json(['success' => false,'message' => $e->errors()['nombre'][1]]);
            }
            if (array_has($e->errors(), 'nombre.string')) {
                return response()->json(['success' => false,'message' => $e->errors()['nombre'][4]]);
            }
            if (array_has($e->errors(), 'IdPerfil.exists')) {
                return response()->json(['success' => false,'message' => $e->errors()['IdPerfil'][0]]);
            }
        }
    }

    //traer descripción de la competencia validando que exista la descripción
    public function traerDescripcion(Request $request){
        $competence = Competencia::find($request->id);
        if($competence->descripcion == null){
            return response()->json(['success' => false,'message' => 'No existe descripción para la competencia']);
        }
        return response()->json(['success' => true,'message' => 'Descripción de la competencia', 'descripcion' => $competence->descripcion]);
    }

    // Agregar descripción de la competencia
    public function guardarDescripcion(Request $request){
        $competence = Competencia::find($request->id);
        $competence->descripcion = $request->descripcion;
        $competence->save();
        return response()->json(['success' => true,'message' => 'Descripción de la competencia agregada', 'id' => $competence->id]);
    }
}
