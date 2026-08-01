<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use App\Models\ObatGolongan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ObatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $obat = Obat::with(['golongan', 'dosis', 'frekuensi'])
            ->orderBy('nama_obat')
            ->get();
        $golongan = ObatGolongan::orderBy('nama')->get();

        return inertia('dashboard/obat', [
            'user' => $user,
            'obat' => $obat,
            'golongan' => $golongan,
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
        $validated = $this->validateObat($request);
        $obat = Obat::create($this->extractObatAttributes($validated));
        $this->syncDosisDanFrekuensi($obat, $validated);

        return redirect()->route('admin.obat.index')->with('success', ['message' => 'Obat berhasil ditambahkan', 'id' => uniqid()]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Obat $obat)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Obat $obat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Obat $obat)
    {
        $validated = $this->validateObat($request);
        $obat->update($this->extractObatAttributes($validated));
        $this->syncDosisDanFrekuensi($obat, $validated);

        return redirect()->route('admin.obat.index')->with('success', ['message' => 'Obat berhasil diperbarui', 'id' => uniqid()]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obat $obat)
    {
        $obat->delete();

        return redirect()->route('admin.obat.index')->with('success', ['message' => 'Obat berhasil dihapus', 'id' => uniqid()]);
    }

    private function validateObat(Request $request): array
    {
        return $request->validate([
            'obat_golongan_id' => ['nullable', Rule::exists('obat_golongans', 'id')],
            'golongan_baru' => ['nullable', 'string', 'max:255', 'required_without:obat_golongan_id'],
            'sub_golongan' => 'nullable|string|max:255',
            'nama_obat' => 'required|string|max:255',
            'is_active' => 'boolean',
            'dosis' => 'required|array|min:1',
            'dosis.*' => 'required|string|max:50',
            'frekuensi' => 'required|array|min:1',
            'frekuensi.*' => 'required|string|max:255',
        ]);
    }

    private function extractObatAttributes(array $validated): array
    {
        $golonganId = $validated['obat_golongan_id'] ?? null;

        if (! $golonganId && ! empty($validated['golongan_baru'])) {
            $golonganId = ObatGolongan::firstOrCreate(['nama' => $validated['golongan_baru']])->id;
        }

        return [
            'obat_golongan_id' => $golonganId,
            'sub_golongan' => $validated['sub_golongan'] ?? null,
            'nama_obat' => $validated['nama_obat'],
            'is_active' => $validated['is_active'] ?? true,
        ];
    }

    private function syncDosisDanFrekuensi(Obat $obat, array $validated): void
    {
        $obat->dosis()->delete();
        foreach (array_values($validated['dosis']) as $index => $dosis) {
            $obat->dosis()->create(['dosis' => $dosis, 'sort_order' => $index]);
        }

        $obat->frekuensi()->delete();
        foreach (array_values($validated['frekuensi']) as $index => $frekuensi) {
            $obat->frekuensi()->create(['frekuensi' => $frekuensi, 'sort_order' => $index]);
        }
    }
}
