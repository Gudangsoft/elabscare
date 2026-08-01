<?php

namespace Database\Seeders;

use App\Models\Obat;
use App\Models\ObatGolongan;
use Illuminate\Database\Seeder;

class ObatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $golongans = [
            'Antihipertensi' => [
                ['nama_obat' => 'Captopril', 'sub_golongan' => 'ACE Inhibitor (ACEi)', 'dosis' => ['12.5 mg', '25 mg', '50 mg'], 'frekuensi' => ['2 x 1 sehari', '3 x 1 sehari (dikonsumsi saat perut kosong)']],
                ['nama_obat' => 'Lisinopril', 'sub_golongan' => 'ACE Inhibitor (ACEi)', 'dosis' => ['5 mg', '10 mg', '20 mg'], 'frekuensi' => ['1 x 1 sehari']],
                ['nama_obat' => 'Ramipril', 'sub_golongan' => 'ACE Inhibitor (ACEi)', 'dosis' => ['2.5 mg', '5 mg', '10 mg'], 'frekuensi' => ['1 x 1 sehari']],
                ['nama_obat' => 'Candesartan', 'sub_golongan' => 'Angiotensin Receptor Blockers (ARB)', 'dosis' => ['8 mg', '16 mg'], 'frekuensi' => ['1 x 1 sehari']],
                ['nama_obat' => 'Valsartan', 'sub_golongan' => 'Angiotensin Receptor Blockers (ARB)', 'dosis' => ['80 mg', '160 mg'], 'frekuensi' => ['1 x 1 sehari']],
                ['nama_obat' => 'Telmisartan', 'sub_golongan' => 'Angiotensin Receptor Blockers (ARB)', 'dosis' => ['40 mg', '80 mg'], 'frekuensi' => ['1 x 1 sehari']],
                ['nama_obat' => 'Irbesartan', 'sub_golongan' => 'Angiotensin Receptor Blockers (ARB)', 'dosis' => ['150 mg', '300 mg'], 'frekuensi' => ['1 x 1 sehari']],
                ['nama_obat' => 'Amlodipine', 'sub_golongan' => 'Calcium Channel Blockers (CCB)', 'dosis' => ['5 mg', '10 mg'], 'frekuensi' => ['1 x 1 sehari']],
                ['nama_obat' => 'Cardipin (Nicardipine)', 'sub_golongan' => 'Calcium Channel Blockers (CCB)', 'dosis' => ['10 mg', '20 mg'], 'frekuensi' => ['2 x 1 sehari', '3 x 1 sehari']],
                ['nama_obat' => 'Nifedipine (Oros / Sustained Release)', 'sub_golongan' => 'Calcium Channel Blockers (CCB)', 'dosis' => ['20 mg', '30 mg'], 'frekuensi' => ['1 x 1 sehari', '2 x 1 sehari']],
                ['nama_obat' => 'Hydrochlorothiazide (HCT)', 'sub_golongan' => 'Diuretik (Thiazide Diuretic)', 'dosis' => ['12.5 mg', '25 mg'], 'frekuensi' => ['1 x 1 sehari (pagi hari)']],
                ['nama_obat' => 'Furosemide', 'sub_golongan' => 'Diuretik (Loop Diuretic)', 'dosis' => ['40 mg'], 'frekuensi' => ['1 x 1 sehari (pagi hari)', '2 x 1 sehari']],
                ['nama_obat' => 'Bisoprolol', 'sub_golongan' => 'Beta Blockers', 'dosis' => ['2.5 mg', '5 mg', '10 mg'], 'frekuensi' => ['1 x 1 sehari']],
                ['nama_obat' => 'Metoprolol', 'sub_golongan' => 'Beta Blockers', 'dosis' => ['50 mg', '100 mg'], 'frekuensi' => ['1 x 1 sehari', '2 x 1 sehari']],
                ['nama_obat' => 'Carvedilol', 'sub_golongan' => 'Beta Blockers', 'dosis' => ['6.25 mg', '12.5 mg', '25 mg'], 'frekuensi' => ['2 x 1 sehari']],
            ],
            'Diabetes Melitus' => [
                ['nama_obat' => 'Metformin', 'sub_golongan' => 'Antidiabetes Oral', 'dosis' => ['500 mg', '850 mg'], 'frekuensi' => ['2 x 1 sehari', '3 x 1 sehari']],
                ['nama_obat' => 'Glimepiride', 'sub_golongan' => 'Antidiabetes Oral', 'dosis' => ['1 mg', '2 mg', '3 mg', '4 mg'], 'frekuensi' => ['1 x 1 sehari (sebelum makan)']],
                ['nama_obat' => 'Glibenclamide', 'sub_golongan' => 'Antidiabetes Oral', 'dosis' => ['2.5 mg', '5 mg'], 'frekuensi' => ['1 x 1 sehari']],
            ],
            'Hiperkolesterol' => [
                ['nama_obat' => 'Simvastatin', 'sub_golongan' => 'Statin', 'dosis' => ['10 mg', '20 mg', '40 mg'], 'frekuensi' => ['1 x 1 sehari (malam hari)']],
                ['nama_obat' => 'Atorvastatin', 'sub_golongan' => 'Statin', 'dosis' => ['10 mg', '20 mg', '40 mg'], 'frekuensi' => ['1 x 1 sehari (malam hari)']],
                ['nama_obat' => 'Fenofibrat', 'sub_golongan' => 'Fibrat', 'dosis' => ['100 mg', '160 mg', '300 mg'], 'frekuensi' => ['1 x 1 sehari']],
                ['nama_obat' => 'Gemfibrozil', 'sub_golongan' => 'Fibrat', 'dosis' => ['300 mg', '600 mg'], 'frekuensi' => ['2 x 1 sehari (sebelum makan)']],
            ],
        ];

        foreach ($golongans as $namaGolongan => $daftarObat) {
            $golongan = ObatGolongan::firstOrCreate(['nama' => $namaGolongan]);

            foreach ($daftarObat as $item) {
                $obat = Obat::updateOrCreate(
                    [
                        'obat_golongan_id' => $golongan->id,
                        'nama_obat' => $item['nama_obat'],
                    ],
                    [
                        'sub_golongan' => $item['sub_golongan'],
                        'is_active' => true,
                    ],
                );

                $obat->dosis()->delete();
                foreach (array_values($item['dosis']) as $index => $dosis) {
                    $obat->dosis()->create(['dosis' => $dosis, 'sort_order' => $index]);
                }

                $obat->frekuensi()->delete();
                foreach (array_values($item['frekuensi']) as $index => $frekuensi) {
                    $obat->frekuensi()->create(['frekuensi' => $frekuensi, 'sort_order' => $index]);
                }
            }
        }
    }
}
