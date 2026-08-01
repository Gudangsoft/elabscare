<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ObatGolongan;
use App\Models\TerapiObat;
use App\Models\User;
use Illuminate\Http\Request;

class TerapiObatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $selectedUserId = $request->input('user_id');

        $pasien = User::where('role', 'user')->orderBy('name')->get(['id', 'name', 'email']);

        $terapi = TerapiObat::with(['obat.golongan', 'user'])
            ->when($selectedUserId, fn ($query) => $query->where('user_id', $selectedUserId))
            ->orderByDesc('tanggal_mulai')
            ->get();

        $masterObat = ObatGolongan::with(['obat' => fn ($query) => $query->active()->with(['dosis', 'frekuensi'])])
            ->orderBy('nama')
            ->get();

        return inertia('dashboard/terapi-obat', [
            'pasien' => $pasien,
            'terapi' => $terapi,
            'masterObat' => $masterObat,
            'selectedUserId' => $selectedUserId ? (int) $selectedUserId : null,
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
            'user_id' => 'required|exists:users,id',
            'entries' => 'required|array|min:1',
            'entries.*.obat_id' => 'required|exists:obats,id',
            'entries.*.dosis' => 'required|string|max:100',
            'entries.*.frekuensi' => 'required|string|max:255',
            'entries.*.status' => 'required|in:aktif,dosis_diubah,dihentikan',
            'entries.*.tanggal_mulai' => 'required|date',
            'entries.*.tanggal_selesai' => 'nullable|date',
            'entries.*.catatan' => 'nullable|string',
        ]);

        foreach ($validated['entries'] as $entry) {
            $tanggalSelesai = $entry['tanggal_selesai'] ?? null;
            if ($entry['status'] === TerapiObat::STATUS_DIHENTIKAN && ! $tanggalSelesai) {
                $tanggalSelesai = now()->toDateString();
            }

            TerapiObat::create([
                'user_id' => $validated['user_id'],
                'obat_id' => $entry['obat_id'],
                'dosis' => $entry['dosis'],
                'frekuensi' => $entry['frekuensi'],
                'status' => $entry['status'],
                'tanggal_mulai' => $entry['tanggal_mulai'],
                'tanggal_selesai' => $tanggalSelesai,
                'catatan' => $entry['catatan'] ?? null,
            ]);
        }

        return redirect()->route('admin.terapi-obat.index')->with('success', ['message' => 'Terapi obat berhasil disimpan', 'id' => uniqid()]);
    }

    /**
     * Display the specified resource.
     */
    public function show(TerapiObat $terapiObat)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TerapiObat $terapiObat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TerapiObat $terapiObat)
    {
        $validated = $request->validate([
            'dosis' => 'required|string|max:100',
            'frekuensi' => 'required|string|max:255',
            'status' => 'required|in:aktif,dosis_diubah,dihentikan',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date',
            'catatan' => 'nullable|string',
        ]);

        if ($validated['status'] === TerapiObat::STATUS_DIHENTIKAN && empty($validated['tanggal_selesai'])) {
            $validated['tanggal_selesai'] = now()->toDateString();
        }

        $terapiObat->update($validated);

        return redirect()->route('admin.terapi-obat.index')->with('success', ['message' => 'Terapi obat berhasil diperbarui', 'id' => uniqid()]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TerapiObat $terapiObat)
    {
        $terapiObat->delete();

        return redirect()->route('admin.terapi-obat.index')->with('success', ['message' => 'Terapi obat berhasil dihapus', 'id' => uniqid()]);
    }
}
