<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI;

class ChatGPTController extends Controller
{
    //prueba de una pregunta de chatGPT
    public function chatGPT(Request $request)
    {
        $client = OpenAI::client(env('OPENAI_API_KEY'));
        $response = $client->chat()->create([
            'model' => 'gpt-4-turbo-preview',
            'messages' => [
                ['role' => 'user', 'content' => $request->pregunta],
            ]
        ]);
        $this->response = $response->choices[0]->message->content;
        return response()->json([
            'success' => true,
            'data' => $this->response
        ]);
    } 
            
}