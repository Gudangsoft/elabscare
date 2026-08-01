<?php

namespace App\Http\Controllers;

use App\Models\AppLogo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AppLogoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $logos = AppLogo::all();
        return Inertia::render('dashboard/app-logo', [
            'user' => $user,
            'logos' => $logos
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AppLogo $app_logo)
    {
         $validatedData =  $request->validate([
            'logo_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

         if ($request->hasFile('banner_image')) {
            Storage::disk('public')->delete($app_logo->logo_path);

            $path = $request->file('banner_image')->store('app_logo', 'public');

            $validatedData['logo_path'] = $path;
        }

        unset($validatedData['app_logo']);

        $app_logo->update($validatedData);

        return redirect()->route('admin.app-logo.index')->with('success', 'Banner updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
