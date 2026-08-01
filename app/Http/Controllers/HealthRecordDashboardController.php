<?php

namespace App\Http\Controllers;

use App\Models\HealthRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class HealthRecordDashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // get health record latest with user
        $user = Auth::user();
        $healthRecords = User::with('latestHealthRecord')->get();
        return Inertia::render('dashboard/health-record', [
            'user' => $user,
            'healthRecords' => $healthRecords,
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
        $userLogin = Auth::user();
        $healthRecords = HealthRecord::where('user_id', $id)->get();
        $user = User::findOrFail($id);

        return Inertia::render('dashboard/detail-health-record', [
            'userLogin' => $userLogin,
            'healthRecords' => $healthRecords,
            'user' => $user,
        ]);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
