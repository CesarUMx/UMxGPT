<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Familia;

class FamiliaController extends Controller
{
    public function index()
    {
        $familias = Familia::pluck('nombre', 'id');
        return view('welcome', compact('familias'));
    }
    
    public function guardarFamilia(Request $request)
    {
        //mensaje de error
        $messages = [
            'nombre.required' => 'El nombre de la familia es requerido.',
            'nombre.max' => 'El nombre de la familia no debe exceder los 255 caracteres.',
            'nombre.unique' => 'El nombre de la familia ya existe.',
            'nombre.regex' => 'El nombre de la familia debe contener solo letras y espacios.',
            'nombre.string' => 'El nombre de la familia debe ser una cadena de texto.',
        ];
       
        //validar datos
        try {
            $request->validate([
                'nombre' => 'required|string|max:255|unique:Familia,nombre|regex:/^[a-zA-Z\s]*$/'
            ], $messages);

            // Procesar los datos válidos
            $familia = new Familia();
            $familia->nombre = $request->nombre;
            $familia->save();

            return response()->json([
                'success' => true,
                'message' => 'Familia guardada correctamente.',
                'id' => $familia->id
            ]);
        } catch (ValidationException $e) {
            if (array_has($e->errors(), 'nombre.unique')) {
                // Hacer algo específico para este error
                return response()->json(['success' => false, 'message' => $e->errors()['nombre'][2]]);
            }
            if (array_has($e->errors(), 'nombre.required')) {
                // Hacer algo específico para este error
                return response()->json(['success' => false, 'message' => $e->errors()['nombre'][0]]);
            }
            if (array_has($e->errors(), 'nombre.regex:')) {
                // Hacer algo específico para este error
                return response()->json(['success' => false, 'message' => $e->errors()['nombre'][3]]);
            }
            if (array_has($e->errors(), 'nombre.max')) {
                // Hacer algo específico para este error
                return response()->json(['success' => false, 'message' => $e->errors()['nombre'][1]]);
            }
            if (array_has($e->errors(), 'nombre.string')) {
                // Hacer algo específico para este error
                return response()->json(['success' => false, 'message' => $e->errors()['nombre'][4]]);
            }
        }
       
    }
    
}