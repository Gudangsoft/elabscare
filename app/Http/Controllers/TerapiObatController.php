<?php

namespace App\Http\Controllers;

use App\Models\ObatGolongan;
use App\Models\TerapiObat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TerapiObatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $terapi = TerapiObat::where('user_id', $user->id)
            ->with('obat.golongan')
            ->orderByDesc('tanggal_mulai')
            ->get();

        $masterObat = ObatGolongan::with(['obat' => fn ($query) => $query->active()->with(['dosis', 'frekuensi'])])
            ->orderBy('nama')
            ->get();

        return inertia('obat/obat', [
            'user' => $user,
            'terapi' => $terapi,
            'masterObat' => $masterObat,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
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
                'user_id' => Auth::id(),
                'obat_id' => $entry['obat_id'],
                'dosis' => $entry['dosis'],
                'frekuensi' => $entry['frekuensi'],
                'status' => $entry['status'],
                'tanggal_mulai' => $entry['tanggal_mulai'],
                'tanggal_selesai' => $tanggalSelesai,
                'catatan' => $entry['catatan'] ?? null,
            ]);
        }

        return redirect()->route('obat.index')->with('success', 'Obat berhasil disimpan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TerapiObat $terapiObat)
    {
        abort_if($terapiObat->user_id !== Auth::id(), 403);

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

        return redirect()->route('obat.index')->with('success', 'Obat berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TerapiObat $terapiObat)
    {
        abort_if($terapiObat->user_id !== Auth::id(), 403);

        $terapiObat->delete();

        return redirect()->route('obat.index')->with('success', 'Obat berhasil dihapus');
    }
}
