<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $banners = Banner::orderBy('id', 'asc')->get();
        return inertia('dashboard/image-banner', [
            'user' => $user,
            'banners' => $banners,
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
        $validated = $request->validate([
            'banner_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $path = $request->file('banner_image')->store('banners', 'public');

        Banner::create([
            'image_path' => $path,
            'is_active' => true,
            'order' => 0,
        ]);

        return redirect()->route('admin.banner-images.index')->with('success', 'Banner created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Banner $banner)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Banner $banner_image)
    {
        $validatedData =  $request->validate([
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
        ]);

         if ($request->hasFile('banner_image')) {
            Storage::disk('public')->delete($banner_image->image_path);

            $path = $request->file('banner_image')->store('banners', 'public');

            $validatedData['image_path'] = $path;
        }

        unset($validatedData['banner_image']);

        $banner_image->update($validatedData);

        return redirect()->route('admin.banner-images.index')->with('success', 'Banner updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Banner $banner_image)
    {
        if ($banner_image->image_path) {
            Storage::disk('public')->delete($banner_image->image_path);
        }
        $banner_image->delete();
        return redirect()->route('admin.banner-images.index')->with('success', 'Banner deleted successfully');
    }
}
