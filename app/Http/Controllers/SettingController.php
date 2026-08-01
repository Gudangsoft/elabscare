<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function indexAppLogo()
    {
        $user = Auth::user();
        $logos = Setting::where('key', 'app_logo')->first();
        return Inertia::render('dashboard/app-logo', [
            'user' => $user,
            'logo' => $logos
        ]);
    }

     public function updateAppLogo(Request $request)
    {
        $validatedData = $request->validate([
        'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    $oldLogoSetting = Setting::where('key', 'app_logo')->first();

    $oldPath = $oldLogoSetting?->value;

    $path = $request->file('logo')->store('app_logo', 'public');

    Setting::updateOrCreate(
        ['key' => 'app_logo'],
        ['value' => $path]
    );

    if ($oldPath) {
        Storage::disk('public')->delete($oldPath);
    }

    Cache::forget('app_logo_path');

    return redirect()->route('admin.app-logo.index')
                     ->with('success', 'Logo aplikasi berhasil diperbarui.');
    }

    public function privacyPolicyPagePWA()
    {
        $privacy = Setting::where('key', 'privacy_policy')->first();
        return Inertia::render('privacy-policy/privacy-policy', [
            'privacy' => $privacy
        ]);
    }
    
    public function indexPrivacyPolicy()
    {
        $user = Auth::user();
        $privacy = Setting::where('key', 'privacy_policy')->first();
        return Inertia::render('dashboard/privacy-policy', [
            'user' => $user,
            'privacy' => $privacy
        ]);
    }

    public function updatePrivacyPolicy(Request $request)
    {
        // 1. Validasi input: pastikan 'content' ada dan berupa teks.
        $request->validate([
            'content' => 'required|string',
        ]);

        // 2. Gunakan updateOrCreate untuk menyimpan konten ke database.
        // - Jika record dengan key 'privacy_policy_content' sudah ada, value-nya akan di-update.
        // - Jika belum ada, record baru akan dibuat.
        Setting::updateOrCreate(
            ['key' => 'privacy_policy'],
            ['value' => $request->input('content')]
        );

        // 3. Redirect kembali ke halaman edit dengan pesan sukses.
        return redirect()->route('admin.privacy-policy.index')
                         ->with('success', 'Kebijakan Privasi berhasil diperbarui.');

    }
}
