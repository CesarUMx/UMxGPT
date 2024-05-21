<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sector;

class SectorController extends Controller
{
    //get all sectors fro id family
    public function getSectores($idFamily){
        
        $sectors = Sector::where('IdFamilia', $idFamily)->get();        

        //$sectors = Sector::pluck('nombre', 'id')->where('IdFamilia', $idFamily);
        return response()->json([
            'success' => true,
            'data' => $sectors,
            'idFamily' => $idFamily
        ]);
    }
    //guardar sector validando que el nombre no exista en bd, que el id de familia exista, y que el nombre no sea nulo
    public function guardarSector(Request $request){

        $messages = [
            'nombre.required' => 'El nombre del sector es requerido.',
            'nombre.max' => 'El nombre del sector no debe exceder los 255 caracteres.',
            'nombre.unique' => 'El nombre del sector ya existe.',
            'nombre.regex' => 'El nombre del sector debe contener solo letras y espacios.',
            'nombre.string' => 'El nombre del sector debe ser una cadena de texto.',
        ];

        try {
            $request->validate([
                'nombre' => 'required|string|max:255|unique:Sectores,nombre|regex:/^[a-zA-Z\s]*$/',
                'id_familia' => 'required|exists:Familia,id'
            ], $messages);
        $sector = new Sector();
        $sector->Nombre = $request->nombre;
        $sector->IdFamilia = $request->id_familia;
        $sector->save();
        return response()->json(['success' => true,'message' => 'Sector guardado correctamente', 'id' => $sector->id]);
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
            if (array_has($e->errors(), 'IdFamilia.exists')) {
                return response()->json(['success' => false,'message' => $e->errors()['IdFamilia'][0]]);
            }
        }
    }
    
}
