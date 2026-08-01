<?php

use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileSettingController;
use App\Http\Controllers\TerapiObatController;
use App\Http\Controllers\TrendController;
use App\Http\Controllers\SettingController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/privacy-policy', [SettingController::class, 'privacyPolicyPagePWA'])->name('home');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');

    Route::get('/trends', [TrendController::class, 'index'])->name('trends.index');

    // Health Records Routes
    // Route::get('/examinations/add', [HealthRecordController::class, 'create'])->name('add-examination');
    // Health Records Routes
    Route::get('/examinations/add', [HealthRecordController::class, 'create'])->name('examinations.create');
    Route::post('/examinations', [HealthRecordController::class, 'store'])->name('examinations.store');
    Route::get('/examinations/{healthRecord}', [HealthRecordController::class, 'show'])->name('examinations.show');
    Route::get('/examinations/{healthRecord}/edit', [HealthRecordController::class, 'edit'])->name('examinations.edit');
    Route::post('/examinations/{healthRecord}', [HealthRecordController::class, 'update'])->name('examinations.update');
    Route::delete('/examinations/{healthRecord}', [HealthRecordController::class, 'destroy'])->name('examinations.destroy');

    Route::get('/history', [HealthRecordController::class, 'index'])->name('history');

    Route::get('/obat', [TerapiObatController::class, 'index'])->name('obat.index');
    Route::post('/obat', [TerapiObatController::class, 'store'])->name('obat.store');
    Route::put('/obat/{terapiObat}', [TerapiObatController::class, 'update'])->name('obat.update');
    Route::delete('/obat/{terapiObat}', [TerapiObatController::class, 'destroy'])->name('obat.destroy');

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');

    Route::get('/panduan', function () {
        return Inertia::render('help/user-guide', [
            'user' => auth()->user(),
        ]);
    })->name('help.index');

    // Route::get('/profile', function () {return Inertia::render('profile/profile');})->name('profile');
    
    Route::get('/profile', [ProfileSettingController::class, 'index'])->name('profile');
    // Route::get('/profile/settings', [ProfileSettingController::class, 'setting'])->name('profile.settings');
    Route::get('profile/settings/edit-profile', [ProfileSettingController::class, 'editProfile'])->name('profile.settings.edit-profile');
    Route::get('profile/settings/edit-password', [ProfileSettingController::class, 'editPassword'])->name('profile.settings.edit-password');
    Route::patch('profile/settings/edit-profile', [ProfileSettingController::class, 'updateProfile'])->name('profile.settings.update-profile');
    Route::put('profile/settings/edit-password', [ProfileSettingController::class, 'updatePassword'])->name('profile.settings.update-password');
});

Route::get('/', function () {
    return Inertia::render('intro/splashscreen');
})->name('splashscreen');

// Route::get('/welcome', function () {
//     return Inertia::render('welcome');
// })->name('welcome');

// Route::get('/splashscreen', function () {
//     return Inertia::render('intro/splashscreen');
// })->name('splashscreen');

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/settings.php';
