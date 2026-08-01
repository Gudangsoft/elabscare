<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LabParameter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LabParameterController extends Controller
{
    public function index()
    {
        $parameters = LabParameter::ordered()->paginate(20);
        
        return Inertia::render('Admin/LabParameters/Index', [
            'parameters' => $parameters
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/LabParameters/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'parameter_code' => 'required|string|max:255',
            'parameter_name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'normal_min' => 'nullable|numeric|min:0',
            'normal_max' => 'nullable|numeric|min:0|gte:normal_min',
            'normal_range_text' => 'required|string|max:255',
            'gender' => 'required|in:all,male,female',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        LabParameter::create($validated);

        return redirect()->route('admin.lab-parameters.index')
            ->with('success', 'Parameter lab berhasil ditambahkan');
    }

    public function edit(LabParameter $labParameter)
    {
        return Inertia::render('Admin/LabParameters/Edit', [
            'parameter' => $labParameter
        ]);
    }

    public function update(Request $request, LabParameter $labParameter)
    {
        $validated = $request->validate([
            'parameter_code' => 'required|string|max:255',
            'parameter_name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'normal_min' => 'nullable|numeric|min:0',
            'normal_max' => 'nullable|numeric|min:0|gte:normal_min',
            'normal_range_text' => 'required|string|max:255',
            'gender' => 'required|in:all,male,female',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        $labParameter->update($validated);

        return redirect()->route('admin.lab-parameters.index')
            ->with('success', 'Parameter lab berhasil diupdate');
    }

    public function destroy(LabParameter $labParameter)
    {
        $labParameter->delete();

        return redirect()->route('admin.lab-parameters.index')
            ->with('success', 'Parameter lab berhasil dihapus');
    }
}