<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'app_logo',
                'value' => 'app_logo/logo.png'
            ],
            [
                'key' => 'privacy_policy',
                'value' => '<h1>Privacy Policy – ElabCare</h1><p><strong>Last Updated: 26 Agustus 2025</strong></p><p>Selamat datang di <strong>ElabCare</strong>. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi yang Anda bagikan ketika menggunakan aplikasi kami. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda.</p><hr><h2>1. Informasi yang Kami Kumpulkan</h2><p>Ketika Anda menggunakan ElabCare, kami dapat mengumpulkan:</p><ul><li><p><strong>Informasi Pribadi</strong>: nama, email, nomor telepon, tanggal lahir.</p></li><li><p><strong>Data Kesehatan</strong>: riwayat medis, catatan kesehatan, hasil pemeriksaan, aktivitas harian, atau informasi terkait kesehatan lain yang Anda input.</p></li><li><p><strong>Data Teknis</strong>: alamat IP, jenis perangkat, sistem operasi, browser, dan aktivitas penggunaan aplikasi.</p></li></ul><hr><h2>2. Bagaimana Kami Menggunakan Informasi Anda</h2><p>Informasi yang kami kumpulkan digunakan untuk:</p><ul><li><p>Menyediakan layanan pemantauan dan tracking kesehatan.</p></li><li><p>Menyimpan serta menampilkan riwayat kesehatan Anda.</p></li><li><p>Memberikan notifikasi atau pengingat terkait kesehatan.</p></li><li><p>Meningkatkan kualitas aplikasi melalui analisis penggunaan.</p></li><li><p>Menghubungi Anda terkait dukungan pengguna, pembaruan layanan, atau informasi penting lainnya.</p></li></ul><hr><h2>3. Berbagi Informasi</h2><p>Kami <strong>tidak menjual atau menyewakan</strong> data pribadi Anda kepada pihak ketiga.<br>Namun, informasi dapat dibagikan jika:</p><ul><li><p>Diperlukan oleh hukum atau peraturan yang berlaku.</p></li><li><p>Dengan persetujuan eksplisit dari Anda.</p></li><li><p>Kepada penyedia layanan pihak ketiga yang membantu operasional aplikasi (misalnya, penyimpanan cloud atau analitik), dengan kewajiban menjaga kerahasiaan.</p></li></ul><hr><h2>4. Keamanan Data</h2><p>Kami menerapkan langkah keamanan teknis dan administratif untuk melindungi data Anda, termasuk enkripsi dan kontrol akses. Namun, perlu dipahami bahwa tidak ada metode transmisi data melalui internet yang 100% aman.</p><hr><h2>5. Hak Pengguna</h2><p>Anda memiliki hak untuk:</p><ul><li><p>Mengakses, memperbarui, atau menghapus data pribadi Anda.</p></li><li><p>Menarik kembali persetujuan Anda terhadap penggunaan data tertentu.</p></li><li><p>Meminta salinan data kesehatan yang telah Anda simpan.</p></li></ul><hr><h2>6. Retensi Data</h2><p>Kami menyimpan data pribadi dan kesehatan Anda selama akun aktif atau diperlukan untuk memberikan layanan. Jika akun Anda dihapus, kami akan menghapus data sesuai ketentuan hukum yang berlaku.</p><hr><h2>7. Cookies &amp; Teknologi Pelacakan</h2><p>ElabCare dapat menggunakan cookies atau teknologi serupa untuk meningkatkan pengalaman pengguna dan menganalisis penggunaan aplikasi. Anda dapat mengatur browser untuk menolak cookies, namun hal ini dapat memengaruhi fungsi aplikasi.</p><hr><h2>8. Perubahan Kebijakan</h2><p>Kami dapat memperbarui Privacy Policy ini dari waktu ke waktu. Perubahan akan diumumkan melalui aplikasi atau email.</p><hr><h2>9. Kontak Kami</h2><p>Jika Anda memiliki pertanyaan mengenai Privacy Policy ini, silakan hubungi kami melalui:<br>📧 Email: elabcare@gmail.com<br>📍 Alamat: Jakarta</p><p></p>'
            ]
            ];

            foreach ($settings as $setting) {
                Setting::updateOrCreate(
                    ['key' => $setting['key']],
                    ['value' => $setting['value']],
                );
            }
    }
}
