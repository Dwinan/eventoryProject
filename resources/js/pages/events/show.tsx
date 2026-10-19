import { Head, Link, router, usePage } from '@inertiajs/react';
import { formatTanggal } from '@/lib/format';
import { useState } from 'react';
import { EventTicketQR } from '@/components/event-ticket-qr';
import { login } from '@/routes';

interface Category {
    id: number;
    name: string;
}

interface Organization {
    id: number;
    name: string;
    user_id: number;
}

interface Event {
    id: number;
    title: string;
    slug: string;
    start_at: string;
    end_at: string;
    location: string;
    quota: number | null;
    poster: string | null;
    description: string;
    categories: Category[];
    organization: Organization | null;
}

interface Props {
    event: Event;
    isBookmarked: boolean;
    registrationStatus: string | null;
    registrationToken: string | null;
    user: { id: number } | null;
}

export default function Show({
    event,
    isBookmarked,
    registrationStatus,
    registrationToken,
    user,
}: Props) {
    const [showQR, setShowQR] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [bookmarkState, setBookmarkState] = useState(isBookmarked);

    const isRegistered = registrationStatus === 'confirmed';
    const isCancelled = registrationStatus === 'cancelled';

    const register = () => {
        if (!user) return;
        setProcessing(true);
        router.post(
            `/events/${event.id}/register`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    const cancel = () => {
        if (!user) return;
        setProcessing(true);
        router.post(
            `/events/${event.id}/cancel`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    const toggleBookmark = () => {
        if (!user) return;
        setBookmarkState(!bookmarkState);
        router.post(
            `/events/${event.id}/bookmark`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => router.reload({ only: ['isBookmarked'] }),
                onError: () => setBookmarkState(bookmarkState),
            },
        );
    };

    const { auth } = usePage().props;

    return (
        <>
            <Head title={event.title} />
            <div className="min-h-screen bg-white dark:bg-neutral-950">
                <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
                    <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-8">
                                <Link href="/" className="text-xl font-bold text-neutral-900 dark:text-white">
                                    Eventory
                                </Link>
                                <Link href="/events" className="text-sm font-medium text-neutral-900 dark:text-white">
                                    Jelajahi Event
                                </Link>
                            </div>
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link href="/dashboard" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/auth/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                                            Masuk
                                        </Link>
                                        <Link href="/auth/register" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                </header>
            <div className="mx-auto max-w-7xl p-6">
                <Link
                    href="/events"
                    className="text-sm text-neutral-600 hover:underline dark:text-neutral-400"
                >
                    ← Kembali
                </Link>
                <h1 className="mt-2 text-3xl font-bold">{event.title}</h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                    Oleh {event.organization?.name ?? '-'}
                </p>

                {event.poster && (
                    <img
                        src={`/storage/${event.poster.startsWith('storage/') ? event.poster.slice(8) : event.poster}`}
                        alt={event.title}
                        className="mt-4 max-h-96 w-full object-cover rounded-lg"
                    />
                )}

                <div className="mt-4 grid gap-3 text-sm sm:max-w-lg">
                    <p>
                        <span className="font-medium">Waktu:</span>{' '}
                        {formatTanggal(event.start_at)} –{' '}
                        {formatTanggal(event.end_at)}
                    </p>
                    <p>
                        <span className="font-medium">Lokasi:</span>{' '}
                        {event.location}
                    </p>
                    <p>
                        <span className="font-medium">Kuota:</span>{' '}
                        {event.quota ?? 'Tidak dibatasi'}
                    </p>
                </div>

                <div className="my-4 flex flex-wrap gap-2">
                    {event.categories.map((c) => (
                        <span
                            key={c.id}
                            className="rounded bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-900"
                        >
                            {c.name}
                        </span>
                    ))}
                </div>

                <p className="mt-4 max-w-xl whitespace-pre-line">
                    {event.description}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:max-w-md">
                    {user ? (
                        <>
                            <div className="flex flex-wrap gap-3">
                                {isRegistered && registrationToken ? (
                                    <button
                                        onClick={() => setShowQR(true)}
                                        className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                                    >
                                        Lihat e-ticket QR
                                    </button>
                                ) : (
                                    <button
                                        onClick={register}
                                        disabled={processing}
                                        className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                                    >
                                        {processing
                                            ? 'Memproses...'
                                            : isCancelled
                                              ? 'Daftar Ulang'
                                              : 'Daftar Event'}
                                    </button>
                                )}
                                <button
                                    onClick={toggleBookmark}
                                    className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                                >
                                    {bookmarkState
                                        ? 'Batal Bookmark'
                                        : 'Bookmark'}
                                </button>
                            </div>
                            {isRegistered && (
                                <button
                                    onClick={cancel}
                                    disabled={processing}
                                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
                                >
                                    Batalkan pendaftaran
                                </button>
                            )}
                        </>
                    ) : (
                        <Link
                            href={login()}
                            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                            Masuk untuk mendaftar
                        </Link>
                    )}
                </div>

                {isRegistered && (
                    <div className="mt-8 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                        <h2 className="text-sm font-medium">
                            Status pendaftaran
                        </h2>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Status: {registrationStatus}. Anda sudah terdaftar
                            di event ini.
                        </p>
                    </div>
                )}
            </div>

            {showQR && isRegistered && registrationToken && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setShowQR(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="qr-title"
                >
                    <div
                        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-neutral-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between">
                            <h2 id="qr-title" className="text-lg font-semibold">
                                E-ticket QR
                            </h2>
                            <button
                                onClick={() => setShowQR(false)}
                                className="rounded p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                aria-label="Tutup modal"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Tunjukkan QR ini petugas saat check-in.
                        </p>
                        <EventTicketQR
                            token={registrationToken}
                            eventTitle={event.title}
                            className="mt-4"
                        />
                        <button
                            onClick={() => setShowQR(false)}
                            className="mt-4 w-full rounded-lg bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
            </div>
        </>
    );
}
