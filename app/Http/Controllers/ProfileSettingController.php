<?php

namespace App\Http\Controllers;

use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ProfileSettingController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('profile/profile', [
            'user' => $user
        ]);
    }

    public function setting()
    {
        return Inertia::render('profile/settings/setting');
    }

    public function editProfile()
    {
        return Inertia::render('profile/settings/edit-profile');
    }

    public function updateProfile(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $avatar = $request->file('avatar');

            $filename = 'avatars/' . Str::uuid() . '.' . $avatar->getClientOriginalExtension();

            $path = $avatar->storeAs('avatars', Str::uuid() . '.' . $avatar->getClientOriginalExtension(), 'public');


            $validated['avatar'] = $path;
        }

        if (!$request->hasFile('avatar')) {
            unset($validated['avatar']);
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return back()->with('status', 'Profile updated successfully');
    }


    public function editPassword()
    {
        $user = Auth::user();
        return Inertia::render('profile/settings/edit-password', [
            'user' => $user
        ]);
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }
}
