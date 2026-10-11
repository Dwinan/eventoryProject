import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { formatTanggal } from '@/lib/format';
import { EventTicketQR } from '@/components/event-ticket-qr';

interface Props {
    role: 'general' | 'organizer' | 'administrator';
    registrations?: Array<{
        id: number;
        status: string;
        token: string | null;
        attended_at: string | null;
        event: {
            id: number;
            title: string;
            slug: string;
            start_at: string;
            location: string;
        };
    }>;
    bookmarks?: Array<{
        id: number;
        title: string;
        slug: string;
        start_at: string;
        location: string;
    }>;
    events?: Array<{
        id: number;
        title: string;
        status: string;
        start_at: string;
        registrations_count: number;
    }>;
    stats?: {
        total_events?: number;
        total_registrations?: number;
        total_organizations?: number;
        total_users?: number;
    };
    organization?: {
        id: number;
        name: string;
        slug: string;
    } | null;
}

export default function Dashboard({
    role,
    registrations = [],
    bookmarks = [],
    events = [],
    stats = {},
    organization = null,
}: Props) {
    if (role === 'organizer') {
        return (
            <OrganizerDashboard
                organization={organization}
                events={events}
                stats={stats}
            />
        );
    }

    if (role === 'administrator') {
        return <AdministratorDashboard stats={stats} />;
    }

    return (
        <GeneralDashboard registrations={registrations} bookmarks={bookmarks} />
    );
}

function GeneralDashboard({
    registrations = [],
    bookmarks = [],
}: {
    registrations: Props['registrations'];
    bookmarks: Props['bookmarks'];
}) {
    const [showQR, setShowQR] = useState<{
        token: string;
        title: string;
    } | null>(null);
    const confirmedRegistrations = registrations.filter(
        (r) => r.status === 'confirmed',
    );

    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Pantau event yang kamu ikuti dan simpan.
                </p>

                <section className="mt-8" aria-labelledby="registered-title">
                    <h2 id="registered-title" className="text-lg font-semibold">
                        Event yang kamu ikuti
                    </h2>
                    {confirmedRegistrations.length === 0 ? (
                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                            Belum ada pendaftaran. Jelajahi{' '}
                            <Link href="/events" className="underline">
                                daftar event
                            </Link>{' '}
                            dan daftar ke kegiatan yang menarik.
                        </p>
                    ) : (
                        <ul className="mt-4 space-y-3">
                            {confirmedRegistrations.map((r) => (
                                <li
                                    key={r.id}
                                    className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800"
                                >
                                    <div>
                                        <Link
                                            href={`/events/${r.event.slug}`}
                                            className="font-medium hover:underline"
                                        >
                                            {r.event.title}
                                        </Link>
                                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                            {formatTanggal(r.event.start_at)} ·{' '}
                                            {r.event.location}
                                        </p>
                                        {r.attended_at && (
                                            <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                                                Sudah hadir
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() =>
                                            setShowQR({
                                                token: r.token ?? '',
                                                title: r.event.title,
                                            })
                                        }
                                        className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                                        disabled={!r.token}
                                    >
                                        Tampilkan QR
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="mt-10" aria-labelledby="bookmark-title">
                    <h2 id="bookmark-title" className="text-lg font-semibold">
                        Bookmark
                    </h2>
                    {bookmarks.length === 0 ? (
                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                            Belum ada event yang disimpan.
                        </p>
                    ) : (
                        <ul className="mt-4 space-y-2">
                            {bookmarks.map((b) => (
                                <li key={b.id}>
                                    <Link
                                        href={`/events/${b.slug}`}
                                        className="block rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                                    >
                                        <span className="font-medium">
                                            {b.title}
                                        </span>
                                        <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
                                            {formatTanggal(b.start_at)}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            {showQR && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setShowQR(null)}
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
                                onClick={() => setShowQR(null)}
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
                        <EventTicketQR
                            token={showQR.token}
                            eventTitle={showQR.title}
                            className="mt-4"
                        />
                        <button
                            onClick={() => setShowQR(null)}
                            className="mt-4 w-full rounded-lg bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

function OrganizerDashboard({
    organization,
    events = [],
    stats = {},
}: {
    organization: Props['organization'];
    events: Props['events'];
    stats: Props['stats'];
}) {
    if (!organization) {
        return (
            <>
                <Head title="Dashboard" />
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Dashboard Organizer</h1>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Akun ini belum terhubung ke organisasi mana pun. Hubungi
                        administrator.
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold">{organization.name}</h1>

                <dl
                    className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    role="list"
                >
                    <StatCard
                        label="Total event"
                        value={stats.total_events ?? 0}
                    />
                    <StatCard
                        label="Total pendaftar"
                        value={stats.total_registrations ?? 0}
                    />
                </dl>

                <div className="mt-8 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Event kamu</h2>
                </div>

                {events.length === 0 ? (
                    <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                        Belum ada event. Buat event pertama kamu.
                    </p>
                ) : (
                    <ul className="mt-4 space-y-2">
                        {events.map((e) => (
                            <li
                                key={e.id}
                                className="flex flex-col gap-2 rounded-lg border border-neutral-200 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800"
                            >
                                <div>
                                    <span className="font-medium">
                                        {e.title}
                                    </span>
                                    <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
                                        {formatTanggal(e.start_at)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {e.registrations_count} pendaftar
                                    </span>
                                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-900">
                                        {e.status}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

function AdministratorDashboard({ stats = {} }: { stats: Props['stats'] }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold">Dashboard Administrator</h1>
                <dl className="mt-6 grid gap-4 sm:grid-cols-3" role="list">
                    <StatCard
                        label="Total event"
                        value={stats.total_events ?? 0}
                    />
                    <StatCard
                        label="Organisasi"
                        value={stats.total_organizations ?? 0}
                    />
                    <StatCard label="Pengguna" value={stats.total_users ?? 0} />
                </dl>
            </div>
        </>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
            <dt className="text-sm text-neutral-500 dark:text-neutral-400">
                {label}
            </dt>
            <dd className="mt-1 text-3xl font-bold">{value}</dd>
        </div>
    );
}
