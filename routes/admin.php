<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\HandleAdminOnly;
use App\Http\Controllers\Admin\LabParameterController;
use App\Http\Controllers\Admin\TerapiObatController;
use App\Http\Controllers\AppLogo;
use App\Http\Controllers\AppLogoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\HealthRecordDashboardController;
use App\Http\Controllers\ObatController;
use App\Http\Controllers\ProfileSettingController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SummaryController;

Route::prefix('admin')->name('admin.')->middleware(HandleAdminOnly::class)->group(function () {
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/', [SummaryController::class, 'index'])->name('admin.dashboard');
        Route::resource('/users', UserController::class)->names('users');
        Route::patch('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
        Route::resource('lab-parameters', LabParameterController::class);
        Route::resource('banner-images', BannerController::class);
        Route::resource('health-records', HealthRecordDashboardController::class);
        Route::resource('obat', ObatController::class);
        Route::resource('terapi-obat', TerapiObatController::class);
        Route::get('profile', [ProfileSettingController::class, 'editAdmin'])->name('profile.edit');
        Route::get('settings/app-logo', [SettingController::class, 'indexAppLogo'])->name('app-logo.index');
        Route::get('settings/privacy-policy', [SettingController::class, 'indexPrivacyPolicy'])->name('privacy-policy.index');
        Route::patch('settings/app-logo', [SettingController::class, 'updateAppLogo'])->name('app-logo.update');
        Route::patch('settings/privacy-policy', [SettingController::class, 'updatePrivacyPolicy'])->name('privacy-policy.update');

        Route::get('/settings', function () {
            return Inertia::render('admin/settings');
        })->name('settings');
    });
});
