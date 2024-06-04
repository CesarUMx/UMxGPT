<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Perfil;

class PerfilController extends Controller
{
    //get all profiles from id activity
    public function getPerfiles($idActividad){
        
        $profiles = Perfil::where('idActividad', $idActividad)->get();        

        return response()->json([
            'success' => true,
            'data' => $profiles,
            'idActividad' => $idActividad
        ]);
    }

    //save profile validating that the name does not exist in the database, that the activity id exists, and that the name is not null
    public function guardarPerfil(Request $request){

        $messages = [
            'nombre.required' => 'El nombre del perfil es requerido.',
            'nombre.max' => 'El nombre del perfil no debe exceder los 255 caracteres.',
            'nombre.regex' => 'El nombre del perfil debe contener solo letras y espacios.',
            'nombre.string' => 'El nombre del perfil debe ser una cadena de texto.',
        ];

        try {
            $request->validate([
                'nombre' => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
                'id_actividad' => 'required|exists:Actividades,id'
            ], $messages);
        $profile = new Perfil();
        $profile->nombre = $request->nombre;
        $profile->idActividad = $request->id_actividad;
        $profile->save();
        return response()->json(['success' => true,'message' => 'Perfil de puesto creado', 'id' => $profile->id]);
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
            if (array_has($e->errors(), 'IdActividad.exists')) {
                return response()->json(['success' => false,'message' => $e->errors()['IdActividad'][0]]);
            }
        }
    }
}
