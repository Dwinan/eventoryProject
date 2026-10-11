import { Head, Link, router } from '@inertiajs/react';
import { formatTanggal } from '@/lib/format';
import { useState } from 'react';
import type { PaginatedData, Category } from '@/types/domain';

interface EventItem {
    id: number;
    title: string;
    slug: string;
    start_at: string;
    end_at: string;
    location: string;
    quota: number | null;
    status: 'draft' | 'published';
    categories: Category[];
}

interface Props {
    events: PaginatedData<EventItem>;
    categories: Category[];
    filters: {
        status?: string;
        search?: string;
    };
}

export default function Index({ events, filters }: Props) {
    const [status, setStatus] = useState(filters.status ?? '');
    const [search, setSearch] = useState(filters.search ?? '');
    const [processing, setProcessing] = useState(false);

    const applyFilters = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        router.get(
            '/organizer/events',
            { status, search },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['events', 'filters'],
                onFinish: () => setProcessing(false),
            },
        );
    };

    const resetFilters = () => {
        setStatus('');
        setSearch('');
        setProcessing(true);
        router.get(
            '/organizer/events',
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['events', 'filters'],
                onFinish: () => setProcessing(false),
            },
        );
    };

    const deleteEvent = (id: number, title: string) => {
        if (confirm(`Yakin ingin menghapus event "${title}"?`)) {
            router.delete(`/organizer/events/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Kelola Event" />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Kelola Event
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Daftar kegiatan yang diselenggarakan oleh organisasi
                            Anda.
                        </p>
                    </div>
                    <Link
                        href="/organizer/events/create"
                        className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                        Buat Event Baru
                    </Link>
                </div>

                <form
                    onSubmit={applyFilters}
                    className="mt-6 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-end dark:border-neutral-800 dark:bg-neutral-950"
                >
                    <div className="flex-1">
                        <label className="block text-sm font-medium">
                            Cari Kegiatan
                        </label>
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Judul event..."
                            className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <label className="block text-sm font-medium">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        >
                            <option value="">Semua Status</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
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
                            {processing ? 'Menyaring...' : 'Filter'}
                        </button>
                    </div>
                </form>

                {events.data.length === 0 ? (
                    <div className="mt-8 rounded-xl border border-neutral-200 p-12 text-center dark:border-neutral-800">
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Belum ada event yang dibuat atau sesuai dengan
                            filter.
                        </p>
                        <Link
                            href="/organizer/events/create"
                            className="mt-4 inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                            Buat Event Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Judul & Waktu
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Lokasi
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Kuota
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {events.data.map((event) => (
                                        <tr
                                            key={event.id}
                                            className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                                                    {event.title}
                                                </div>
                                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {formatTanggal(
                                                        event.start_at,
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                                                {event.location}
                                            </td>
                                            <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                                                {event.quota ??
                                                    'Tidak terbatas'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        event.status ===
                                                        'published'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                                                            : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                                                    }`}
                                                >
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/organizer/events/${event.id}/edit`}
                                                        className="rounded px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            deleteEvent(
                                                                event.id,
                                                                event.title,
                                                            )
                                                        }
                                                        className="rounded px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {events.links.length > 3 && (
                            <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
                                <div className="text-xs text-neutral-500">
                                    Menampilkan {events.from ?? 0} sampai{' '}
                                    {events.to ?? 0} dari {events.total} event
                                </div>
                                <div className="flex gap-1">
                                    {events.links.map((link, i) =>
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`rounded px-3 py-1 text-xs font-medium ${
                                                    link.active
                                                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                                                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                key={i}
                                                className="px-3 py-1 text-xs text-neutral-400 dark:text-neutral-600"
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
