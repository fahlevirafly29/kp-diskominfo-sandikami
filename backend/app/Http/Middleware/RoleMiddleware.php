<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role): Response
    {
        // Mengecek: Apakah user sudah login? DAN apakah role-nya sesuai syarat pintu?
        if ($request->user() && $request->user()->role === $role) {
            return $next($request); // Jika ya, silakan masuk ke dalam Controller
        }

        // Jika bukan, tolak dengan pesan error (403 Forbidden)
        return response()->json([
            'status' => 'error',
            'message' => 'Akses ditolak. Anda tidak memiliki izin untuk tindakan ini.'
        ], 403);
    }
}