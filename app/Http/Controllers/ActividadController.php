<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Actividad;

class ActividadController extends Controller
{
    //get all activities from id sector
    public function getActividades($idSector){
        
        $activities = Actividad::where('idSector', $idSector)->get();        

        return response()->json([
            'success' => true,
            'data' => $activities,
            'idSector' => $idSector
        ]);
    }

    //save activity validating that the name does not exist in the database, that the sector id exists, and that the name is not null   
    public function guardarActividad(Request $request){

        $messages = [
            'nombre.required' => 'El nombre de la actividad es requerido.',
            'nombre.max' => 'El nombre de la actividad no debe exceder los 255 caracteres.',
            'nombre.unique' => 'El nombre de la actividad ya existe.',
            'nombre.regex' => 'El nombre de la actividad debe contener solo letras y espacios.',
            'nombre.string' => 'El nombre de la actividad debe ser una cadena de texto.',
        ];

        try {
            $request->validate([
                'nombre' => 'required|string|max:255|unique:Actividades,nombre|regex:/^[a-zA-Z\s]*$/',
                'id_sector' => 'required|exists:Sectores,id'
            ], $messages);
        $activity = new Actividad();
        $activity->nombre = $request->nombre;
        $activity->idSector = $request->id_sector;
        $activity->save();
        return response()->json(['success' => true,'message' => 'Activity saved correctly', 'id' => $activity->id]);
        } catch (ValidationException $e) {
            if (array_has($e->errors(), 'nombre.unique')) {
                return response()->json(['success' => false,'message' => $e->errors()['nombre'][2]]);
            }
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
            if (array_has($e->errors(), 'IdSector.exists')) {
                return response()->json(['success' => false,'message' => $e->errors()['IdSector'][0]]);
            }
        }
    }
}
