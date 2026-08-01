<?php

namespace App\Console\Commands;

use App\Models\Notification;
use App\Models\TerapiObat;
use Illuminate\Console\Command;

class GenerateObatReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'obat:generate-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Buat pengingat harian untuk pasien dengan terapi obat yang sedang aktif';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $today = now()->toDateString();

        $activeTherapies = TerapiObat::where('status', TerapiObat::STATUS_AKTIF)
            ->whereDate('tanggal_mulai', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('tanggal_selesai')->orWhereDate('tanggal_selesai', '>=', $today);
            })
            ->with('obat')
            ->get();

        $created = 0;

        foreach ($activeTherapies as $terapi) {
            $title = 'Jadwal Minum Obat: ' . $terapi->obat->nama_obat;

            $alreadySent = Notification::where('user_id', $terapi->user_id)
                ->where('title', $title)
                ->whereDate('created_at', $today)
                ->exists();

            if ($alreadySent) {
                continue;
            }

            Notification::create([
                'user_id' => $terapi->user_id,
                'title' => $title,
                'message' => "Jangan lupa minum {$terapi->obat->nama_obat} {$terapi->dosis}, {$terapi->frekuensi}.",
                'is_read' => false,
                'scheduled_at' => now(),
            ]);

            $created++;
        }

        $this->info("Berhasil membuat {$created} pengingat obat.");

        return self::SUCCESS;
    }
}
