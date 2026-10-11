import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Eventory: Sistem Informasi Kegiatan Kampus" />
            <div className="min-h-screen bg-white dark:bg-neutral-950">
                {/* Navigation */}
                <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
                    <nav
                        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                        aria-label="Main navigation"
                    >
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-8">
                                <Link
                                    href="/"
                                    className="text-xl font-bold text-neutral-900 dark:text-white"
                                >
                                    Eventory
                                </Link>
                                <div className="hidden md:flex md:gap-6">
                                    <Link
                                        href="/events"
                                        className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                                    >
                                        Jelajahi Event
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main>
                    <section className="relative overflow-hidden py-20 lg:py-32">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-3xl text-center">
                                <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl dark:text-white">
                                    Temukan & Daftar Kegiatan Kampus
                                    <br />
                                    <span className="text-neutral-900 dark:text-white">
                                        Tanpa Ribet
                                    </span>
                                </h1>
                                <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
                                    Semua event UKM, BEM, dan HMJ di satu
                                    platform. Daftar sekali klik, dapatkan
                                    e-ticket QR, dan hadir tepat waktu.
                                </p>
                                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    {auth.user ? (
                                        <Link
                                            href="/events"
                                            className="w-full rounded-lg bg-neutral-900 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-neutral-700 sm:w-auto dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                                        >
                                            Lihat Semua Event
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={register()}
                                                className="w-full rounded-lg bg-neutral-900 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-neutral-700 sm:w-auto dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                                            >
                                                Daftar Sekarang
                                            </Link>
                                            <Link
                                                href={login()}
                                                className="w-full rounded-lg border border-neutral-300 bg-white px-8 py-3 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-50 sm:w-auto dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                                            >
                                                Masuk
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Featured Events */}
                    <section className="bg-neutral-50 py-16 dark:bg-neutral-900">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mb-12 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Event Terbaru
                                </h2>
                            </div>
                            <Link
                                href="/events"
                                className="block rounded-xl border border-neutral-200 bg-white p-8 text-center hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800"
                            >
                                <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                    Lihat katalog event UKM, BEM, dan HMJ
                                </p>
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    Semua kegiatan yang sedang dan akan
                                    berlangsung tersedia di satu daftar, lengkap
                                    dengan lokasi, waktu, dan kuota.
                                </p>
                                <span className="mt-4 inline-block rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
                                    Buka daftar event
                                </span>
                            </Link>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="py-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid gap-8 md:grid-cols-3">
                                <FeatureCard
                                    icon={
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    }
                                    title="Daftar Satu Klik"
                                    description="Tidak perlu isi formulir panjang. Cari event, klik daftar, dan Anda terdaftar."
                                />
                                <FeatureCard
                                    icon={
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    }
                                    title="E-Ticket QR"
                                    description="Setiap pendaftaran menghasilkan QR code unik. Tampilkan di HP, scan di lokasi."
                                />
                                <FeatureCard
                                    icon={
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                            />
                                        </svg>
                                    }
                                    title="Presensi Real-time"
                                    description="Panitia scan QR, kehadiran tercatat otomatis. Tidak ada antrian manual."
                                />
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-neutral-900 py-16 dark:bg-neutral-950">
                        <div className="mx-auto max-w-3xl px-4 text-center">
                            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                                Siap mengikuti kegiatan kampus?
                            </h2>
                            <p className="mb-8 text-neutral-300 dark:text-neutral-400">
                                Bergabunglah dengan ribuan mahasiswa yang sudah
                                menggunakan Eventory untuk tidak ketinggalan
                                event menarik.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    href={register()}
                                    className="w-full rounded-lg bg-white px-8 py-3 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-100 sm:w-auto dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                                >
                                    Buat Akun Gratis
                                </Link>
                                <Link
                                    href="/events"
                                    className="w-full rounded-lg border border-neutral-700 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-neutral-800 sm:w-auto"
                                >
                                    Jelajahi Event Dulu
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-neutral-200 py-12 dark:border-neutral-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                © 2024 Eventory. Sistem Informasi Kegiatan
                                Kampus.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function FeatureCard({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
                {Icon}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
                {title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
                {description}
            </p>
        </div>
    );
}
