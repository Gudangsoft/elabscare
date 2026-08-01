<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class HandleAdminOnly
{
    public function handle($request, Closure $next)
    {
        $user = Auth::user();
        // dd($user);
        if (!$user || $user->role !== 'admin') {
            abort(403);
        }
        return $next($request);
    }
}