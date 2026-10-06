<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\EventModerationController;
use App\Http\Controllers\Admin\OrganizationController as AdminOrganizationController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\Organizer\EventManagerController;
use App\Http\Controllers\Organizer\PresenceController;
use App\Http\Controllers\Organizer\ProfileController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('events', [EventController::class, 'index'])->name('events.index');
Route::get('events/{slug}', [EventController::class, 'show'])->name('events.show');
Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('blade/events', [EventController::class, 'indexBlade'])->name('blade.events.index');
Route::get('blade/events/{slug}', [EventController::class, 'showBlade'])->name('blade.events.show');

// Authenticated
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('events/{event}/bookmark', [BookmarkController::class, 'store'])->name('events.bookmark');
    Route::delete('events/{event}/bookmark', [BookmarkController::class, 'destroy'])->name('events.unbookmark');
    Route::post('events/{event}/register', [RegistrationController::class, 'store'])->name('events.register');
    Route::post('events/{event}/cancel', [RegistrationController::class, 'destroy'])->name('events.cancel');
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Organizer & Administrator
Route::middleware(['auth', 'verified', 'role:organizer,administrator'])->prefix('organizer')->name('organizer.')->group(function () {
    Route::resource('events', EventManagerController::class)->except(['show']);
    Route::get('profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::match(['put', 'patch'], 'profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('registrations/{registration}/scan', [PresenceController::class, 'scan'])->name('registrations.scan');
});

// Administrator
Route::middleware(['auth', 'verified', 'role:administrator'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('events/{event}/take-down', [EventModerationController::class, 'takeDown'])->name('events.take-down');
    Route::post('events/{event}/restore', [EventModerationController::class, 'restore'])->name('events.restore');
    Route::resource('organizations', AdminOrganizationController::class);
    Route::resource('categories', AdminCategoryController::class);
    Route::resource('users', AdminUserController::class);
});
