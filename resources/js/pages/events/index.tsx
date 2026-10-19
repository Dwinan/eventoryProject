import { Head, Link, router, usePage } from '@inertiajs/react';
import { formatTanggal } from '@/lib/format';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Event {
    id: number;
    title: string;
    slug: string;
    start_at: string;
    location: string;
    quota: number | null;
    poster: string | null;
    categories: Category[];
}

interface PaginatedEvents {
    data: Event[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    events: PaginatedEvents;
    categories: Category[];
    filters: { category?: string; search?: string; sort?: string };
}

const SORT_OPTIONS = [
    { value: 'date-asc', label: 'Waktu terdekat' },
    { value: 'date-desc', label: 'Waktu terjauh' },
    { value: 'title-asc', label: 'Nama A-Z' },
    { value: 'quota-desc', label: 'Kuota tersedia terbanyak' },
];

export default function Index({ events, categories, filters }: Props) {
    const [category, setCategory] = useState(filters.category ?? '');
    const [search, setSearch] = useState(filters.search ?? '');
    const [sort, setSort] = useState(filters.sort ?? 'date-asc');
    const [processing, setProcessing] = useState(false);

    const applyFilters = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        router.get(
            '/events',
            { category, search, sort },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['events', 'filters'],
                onFinish: () => setProcessing(false),
            },
        );
    };

    const resetFilters = () => {
        setCategory('');
        setSearch('');
        setSort('date-asc');
        setProcessing(true);
        router.get(
            '/events',
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['events', 'filters'],
                onFinish: () => setProcessing(false),
            },
        );
    };

    const { auth } = usePage().props;

    return (
        <>
            <Head title="Daftar Event" />
            <div className="min-h-screen bg-white dark:bg-neutral-950">
                <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
                    <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-8">
                                <Link
                                    href="/"
                                    className="text-xl font-bold text-neutral-900 dark:text-white"
                                >
                                    Eventory
                                </Link>
                                <Link
                                    href="/events"
                                    className="text-sm font-medium text-neutral-900 dark:text-white"
                                >
                                    Jelajahi Event
                                </Link>
                            </div>
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/auth/login"
                                            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href="/auth/register"
                                            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                </header>
                <div className="mx-auto max-w-7xl p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Daftar Event</h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Temukan kegiatan kampus yang sesuai minat kamu.
                        </p>
                    </div>

                    <form
                        onSubmit={applyFilters}
                        className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"
                    >
                        <div className="grid gap-4 sm:grid-cols-3">
                            <label>
                                <span className="mb-1 block text-sm font-medium">
                                    Kategori
                                </span>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                >
                                    <option value="">Semua kategori</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.slug}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <span className="mb-1 block text-sm font-medium">
                                    Cari event
                                </span>
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Judul atau lokasi..."
                                    className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                />
                            </label>
                            <label>
                                <span className="mb-1 block text-sm font-medium">
                                    Urutkan
                                </span>
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                            >
                                {processing
                                    ? 'Menerapkan...'
                                    : 'Terapkan filter'}
                            </button>
                        </div>
                    </form>

                    {events.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-neutral-500 dark:text-neutral-400">
                                Belum ada event yang cocok dengan filter kamu.
                            </p>
                            <button
                                onClick={resetFilters}
                                className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                            >
                                Reset filter
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4 md:grid-cols-3">
                                {events.data.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {events.links.map((l, i) =>
                                    l.url ? (
                                        <Link
                                            key={i}
                                            href={l.url}
                                            className={`rounded border px-3 py-1 ${
                                                l.active
                                                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                                                    : ''
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: l.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="px-3 py-1 text-neutral-400 dark:text-neutral-500"
                                            dangerouslySetInnerHTML={{
                                                __html: l.label,
                                            }}
                                        />
                                    ),
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

function EventCard({ event }: { event: Event }) {
    return (
        <Link
            href={`/events/${event.slug}`}
            className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
        >
            {event.poster && (
                <img
                    src={`/storage/${event.poster.startsWith('storage/') ? event.poster.slice(8) : event.poster}`}
                    alt={event.title}
                    className="h-48 w-full object-cover"
                />
            )}
            <div className="p-4">
                <h2 className="font-semibold">{event.title}</h2>
                <p className="mt-1 text-sm">{formatTanggal(event.start_at)}</p>
                <p className="text-sm">{event.location}</p>
                {event.quota !== null && (
                    <p className="mt-1 text-sm">Kuota: {event.quota}</p>
                )}
                <div className="mt-2">
                    {event.categories.map((c) => (
                        <span
                            key={c.id}
                            className="mr-1 rounded bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-900"
                        >
                            {c.name}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
