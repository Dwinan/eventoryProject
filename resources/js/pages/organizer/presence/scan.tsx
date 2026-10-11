import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface EventOption {
    id: number;
    title: string;
    start_at: string;
}

interface VerifiedRegistration {
    id: number;
    status: string;
    attended_at: string | null;
    user?: {
        name: string;
        npm: string | null;
    };
    event?: {
        title: string;
    };
}

interface Props {
    events?: EventOption[];
}

export default function Scan({ events = [] }: Props) {
    const [token, setToken] = useState('');
    const [eventId, setEventId] = useState<number | ''>(
        events.length > 0 ? events[0].id : '',
    );
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);
    const [lastVerified, setLastVerified] =
        useState<VerifiedRegistration | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token.trim()) {
            return;
        }

        setProcessing(true);
        setMessage(null);
        setIsError(false);

        try {
            const csrfToken =
                (
                    document.querySelector(
                        'meta[name="csrf-token"]',
                    ) as HTMLMetaElement
                )?.content ?? '';

            const response = await fetch('/organizer/presence/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    token: token.trim(),
                    event_id: eventId || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setIsError(true);
                setMessage(data.message || 'Gagal memverifikasi token.');
                if (data.registration) {
                    setLastVerified(data.registration);
                }
            } else {
                setIsError(false);
                setMessage(data.message || 'Presensi berhasil dikonfirmasi.');
                setLastVerified(data.registration);
                setToken('');
            }
        } catch {
            setIsError(true);
            setMessage('Terjadi kendala jaringan saat memverifikasi.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Verifikasi Presensi" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Verifikasi Presensi Peserta
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        Pindai atau masukkan token UUID dari e-ticket peserta
                        untuk konfirmasi kehadiran.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {events.length > 0 && (
                                <div>
                                    <label
                                        htmlFor="event_id"
                                        className="block text-sm font-medium"
                                    >
                                        Pilih Kegiatan
                                    </label>
                                    <select
                                        id="event_id"
                                        value={eventId}
                                        onChange={(e) =>
                                            setEventId(
                                                e.target.value
                                                    ? Number(e.target.value)
                                                    : '',
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                    >
                                        <option value="">Semua Kegiatan</option>
                                        {events.map((ev) => (
                                            <option key={ev.id} value={ev.id}>
                                                {ev.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="token"
                                    className="block text-sm font-medium"
                                >
                                    Token Presensi (UUID)
                                </label>
                                <input
                                    id="token"
                                    type="text"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="Contoh: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !token.trim()}
                                className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                            >
                                {processing
                                    ? 'Memverifikasi...'
                                    : 'Konfirmasi Kehadiran'}
                            </button>
                        </form>

                        {message && (
                            <div
                                className={`mt-4 rounded-lg p-3 text-sm ${
                                    isError
                                        ? 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300'
                                        : 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300'
                                }`}
                            >
                                {message}
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                        <h2 className="text-base font-semibold">
                            Hasil Verifikasi Terakhir
                        </h2>
                        {lastVerified ? (
                            <div className="mt-4 space-y-3 rounded-lg border border-neutral-200 p-4 text-sm dark:border-neutral-800">
                                <div>
                                    <span className="text-xs text-neutral-500">
                                        Nama Peserta
                                    </span>
                                    <p className="font-medium">
                                        {lastVerified.user?.name ?? '-'}
                                    </p>
                                </div>
                                {lastVerified.user?.npm && (
                                    <div>
                                        <span className="text-xs text-neutral-500">
                                            NPM
                                        </span>
                                        <p className="font-mono">
                                            {lastVerified.user.npm}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-xs text-neutral-500">
                                        Kegiatan
                                    </span>
                                    <p>{lastVerified.event?.title ?? '-'}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-neutral-500">
                                        Status
                                    </span>
                                    <p className="font-semibold text-green-600 dark:text-green-400">
                                        Hadir
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-neutral-500">
                                Belum ada presensi yang diverifikasi pada sesi
                                ini.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
