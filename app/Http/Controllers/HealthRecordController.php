<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HealthRecord;
use App\Models\TerapiObat;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Exception;
use App\Services\LabParameterService;

class HealthRecordController extends Controller
{

    protected $labParameterService;

    public function __construct(LabParameterService $labParameterService)
    {
        $this->labParameterService = $labParameterService;
    }

    public function index()
    {
        $user = Auth::user();
        $healthRecords = HealthRecord::where('user_id', Auth::id())
            ->orderBy('recorded_at', 'desc')
            ->paginate(10);

        // Analyze each record untuk status
        $healthRecordsWithAnalysis = $healthRecords->through(function ($record) use ($user) {
            $analysis = $this->labParameterService->analyzeHealthRecord($record, $user->gender);
            $overallStatus = $this->labParameterService->getOverallStatus($record, $user->gender);

            // Add analysis and status to record
            $record->analysis = $analysis;
            $record->overall_status = $overallStatus;

            return $record;
        });

        $today = now()->toDateString();
        $activeMedications = TerapiObat::where('user_id', $user->id)
            ->where('status', TerapiObat::STATUS_AKTIF)
            ->whereDate('tanggal_mulai', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('tanggal_selesai')->orWhereDate('tanggal_selesai', '>=', $today);
            })
            ->with('obat')
            ->orderBy('tanggal_mulai')
            ->get()
            ->map(fn ($terapi) => [
                'id' => $terapi->id,
                'nama_obat' => $terapi->obat->nama_obat,
                'dosis' => $terapi->dosis,
                'frekuensi' => $terapi->frekuensi,
            ])
            ->values();

        return Inertia::render('history/history', [
            'user' => $user,
            'healthRecords' => $healthRecordsWithAnalysis,
            'activeMedications' => $activeMedications,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        return Inertia::render('examinations/add-examination', [
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'sugar_fasting' => 'nullable|numeric|min:0|max:999.99',
                'sugar_after_meal' => 'nullable|numeric|min:0|max:999.99',
                'sugar_random' => 'nullable|numeric|min:0|max:999.99',
                'cholesterol_total' => 'nullable|numeric|min:0|max:999.99',
                'triglycerides' => 'nullable|numeric|min:0|max:999.99',
                'hdl' => 'nullable|numeric|min:0|max:999.99',
                'ldl' => 'nullable|numeric|min:0|max:999.99',
                'uric_acid' => 'nullable|numeric|min:0|max:999.99',
                'systolic' => 'nullable|integer|min:0|max:300',
                'diastolic' => 'nullable|integer|min:0|max:200',
                'recorded_at' => 'required|date',
                'lab_document' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:5120', // 5MB max
            ], [
                'recorded_at.required' => 'Tanggal pemeriksaan harus diisi',
                'recorded_at.date' => 'Format tanggal tidak valid',
                'lab_document.mimes' => 'File harus berformat JPG, PNG, atau PDF',
                'lab_document.max' => 'Ukuran file maksimal 5MB',
                '*.numeric' => 'Nilai harus berupa angka',
                '*.min' => 'Nilai tidak boleh negatif',
                '*.max' => 'Nilai terlalu besar',
            ]);

            // Check if at least one examination value is provided
            $examValues = [
                'sugar_fasting',
                'sugar_after_meal',
                'sugar_random',
                'cholesterol_total',
                'triglycerides',
                'hdl',
                'ldl',
                'uric_acid',
                'systolic',
                'diastolic'
            ];

            $hasValues = false;
            foreach ($examValues as $field) {
                if (!empty($validated[$field]) && $validated[$field] > 0) {
                    $hasValues = true;
                    break;
                }
            }

            if (!$hasValues) {
                throw ValidationException::withMessages([
                    'general' => 'Minimal satu nilai pemeriksaan harus diisi'
                ]);
            }

            // Handle file upload
            $documentPath = null;
            $documentType = null;

            if ($request->hasFile('lab_document')) {
                $file = $request->file('lab_document');

                // Ensure directory exists
                $directory = 'health-documents';
                if (!Storage::disk('public')->exists($directory)) {
                    Storage::disk('public')->makeDirectory($directory);
                }

                $fileName = time() . '_' . $file->getClientOriginalName();
                $documentPath = $file->storeAs($directory, $fileName, 'public');

                // Debug: Check if file was actually stored
                if (!$documentPath) {
                    Log::error('Failed to store file: ' . $file->getClientOriginalName());
                    throw new Exception('Gagal mengupload file');
                }

                // Determine document type based on file MIME type
                $mimeType = $file->getMimeType();
                if (in_array($mimeType, ['image/jpeg', 'image/jpg', 'image/png'])) {
                    $documentType = 'image';
                } elseif ($mimeType === 'application/pdf') {
                    $documentType = 'pdf';
                } else {
                    $documentType = 'other';
                }
            }

            // dd($documentPath, $documentType);

            // Create the health record
            $healthRecord = HealthRecord::create([
                'user_id' => Auth::id(),
                'sugar_fasting' => $validated['sugar_fasting'] ?: null,
                'sugar_after_meal' => $validated['sugar_after_meal'] ?: null,
                'sugar_random' => $validated['sugar_random'] ?: null,
                'cholesterol_total' => $validated['cholesterol_total'] ?: null,
                'triglycerides' => $validated['triglycerides'] ?: null,
                'hdl' => $validated['hdl'] ?: null,
                'ldl' => $validated['ldl'] ?: null,
                'uric_acid' => $validated['uric_acid'] ?: null,
                'systolic' => $validated['systolic'] ?: null,
                'diastolic' => $validated['diastolic'] ?: null,
                'recorded_at' => $validated['recorded_at'],
                'type_document' => $documentType,
                'lab_document' => $documentPath,
            ]);

            return redirect()->route('history')->with(
                'success',
                'Data pemeriksaan berhasil disimpan!'
            );
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'general' => 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.'
            ])->withInput();
        }
    }

    public function show(HealthRecord $healthRecord)
    {
        // Make sure user can only view their own records
        if ($healthRecord->user_id !== Auth::id()) {
            abort(403);
        }

        $user = Auth::user();
        $analysis = $this->labParameterService->analyzeHealthRecord($healthRecord, $user->gender);
        $overallStatus = $this->labParameterService->getOverallStatus($healthRecord, $user->gender);

        return Inertia::render('history/detail-history-examination', [
            'user' => $user,
            'healthRecord' => $healthRecord,
            'analysis' => $analysis,
            'overallStatus' => $overallStatus
        ]);
    }

    public function edit(HealthRecord $healthRecord)
    {
        // Make sure user can only edit their own records
        if ($healthRecord->user_id !== Auth::id()) {
            abort(403);
        }
        $user = Auth::user();

        return Inertia::render('examinations/edit-examination', [
            'user' => $user,
            'healthRecord' => $healthRecord
        ]);
    }

    public function update(Request $request, HealthRecord $healthRecord)
    {
        // Make sure user can only update their own records
        if ($healthRecord->user_id !== Auth::id()) {
            abort(403);
        }

        // dd("minum", $healthRecord->recorded_at);

        try {
            $validated = $request->validate([
                'sugar_fasting' => 'nullable|numeric|min:0|max:999.99',
                'sugar_after_meal' => 'nullable|numeric|min:0|max:999.99',
                'sugar_random' => 'nullable|numeric|min:0|max:999.99',
                'cholesterol_total' => 'nullable|numeric|min:0|max:999.99',
                'triglycerides' => 'nullable|numeric|min:0|max:999.99',
                'hdl' => 'nullable|numeric|min:0|max:999.99',
                'ldl' => 'nullable|numeric|min:0|max:999.99',
                'uric_acid' => 'nullable|numeric|min:0|max:999.99',
                'systolic' => 'nullable|integer|min:0|max:300',
                'diastolic' => 'nullable|integer|min:0|max:200',
                'recorded_at' => 'required|date',
                'lab_document' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:5120',
            ]);

            // dd("makan", $healthRecord->recorded_at);

            // Handle new file upload
            $documentPath = $healthRecord->lab_document;
            $documentType = $healthRecord->type_document;

            // dd($healthRecord);

            if ($request->hasFile('lab_document')) {
                // Delete old file if exists
                if ($documentPath && Storage::disk('public')->exists($documentPath)) {
                    Storage::disk('public')->delete($documentPath);
                }

                $file = $request->file('lab_document');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $documentPath = $file->storeAs('health-documents', $fileName, 'public');

                // Determine document type based on file MIME type
                $mimeType = $file->getMimeType();
                if (in_array($mimeType, ['image/jpeg', 'image/jpg', 'image/png'])) {
                    $documentType = 'image';
                } elseif ($mimeType === 'application/pdf') {
                    $documentType = 'pdf';
                } else {
                    $documentType = 'other';
                }
            }

            $healthRecord->update([
                'sugar_fasting' => $validated['sugar_fasting'] ?: null,
                'sugar_after_meal' => $validated['sugar_after_meal'] ?: null,
                'sugar_random' => $validated['sugar_random'] ?: null,
                'cholesterol_total' => $validated['cholesterol_total'] ?: null,
                'triglycerides' => $validated['triglycerides'] ?: null,
                'hdl' => $validated['hdl'] ?: null,
                'ldl' => $validated['ldl'] ?: null,
                'uric_acid' => $validated['uric_acid'] ?: null,
                'systolic' => $validated['systolic'] ?: null,
                'diastolic' => $validated['diastolic'] ?: null,
                'recorded_at' => $validated['recorded_at'],
                'type_document' => $documentType,
                'lab_document' => $documentPath,
            ]);

            return redirect()->route('examinations.show', $healthRecord->id)->with('success', 'Data pemeriksaan berhasil diupdate!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        }
    }

    public function destroy(HealthRecord $healthRecord)
    {
        // Make sure user can only delete their own records
        if ($healthRecord->user_id !== Auth::id()) {
            abort(403);
        }

        // Delete associated file if exists
        if ($healthRecord->lab_document && Storage::disk('public')->exists($healthRecord->lab_document)) {
            Storage::disk('public')->delete($healthRecord->lab_document);
        }

        $healthRecord->delete();

        return redirect()->route('health-records.index')->with('success', 'Data pemeriksaan berhasil dihapus!');
    }
}
