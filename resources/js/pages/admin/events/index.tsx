import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { formatTanggal } from '@/lib/format';
import type { PaginatedData, Category, Organization } from '@/types/domain';

interface AdminEventItem {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    start_at: string;
    location: string;
    quota: number | null;
    moderated_by: number | null;
    moderated_at: string | null;
    organization?: Organization;
    categories?: Category[];
}

interface Props {
    events: PaginatedData<AdminEventItem>;
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
            '/admin/events',
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
            '/admin/events',
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['events', 'filters'],
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleTakeDown = (eventId: number, title: string) => {
        if (
            confirm(
                `Takedown event "${title}"? Status akan diubah menjadi draft.`,
            )
        ) {
            router.post(
                `/admin/events/${eventId}/take-down`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const handleRestore = (eventId: number, title: string) => {
        if (
            confirm(
                `Pulihkan event "${title}"? Status akan dikembalikan ke published.`,
            )
        ) {
            router.post(
                `/admin/events/${eventId}/restore`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    return (
        <>
            <Head title="Moderasi Event" />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Moderasi Kegiatan Kampus
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Pantau dan kelola publikasi kegiatan seluruh ormawa.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={applyFilters}
                    className="mt-6 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-end dark:border-neutral-800 dark:bg-neutral-950"
                >
                    <div className="flex-1">
                        <label
                            htmlFor="search"
                            className="block text-sm font-medium"
                        >
                            Cari Kegiatan
                        </label>
                        <input
                            id="search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Judul event..."
                            className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        />
                    </div>

                    <div className="w-full sm:w-48">
                        <label
                            htmlFor="status"
                            className="block text-sm font-medium"
                        >
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        >
                            <option value="">Semua Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
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
                            Tidak ada event yang ditemukan sesuai kriteria.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Kegiatan & Ormawa
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Waktu & Lokasi
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Jejak Moderasi
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {events.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                                                    <Link
                                                        href={`/events/${item.slug}`}
                                                        className="hover:underline"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </div>
                                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {item.organization?.name ??
                                                        'Organisasi Umum'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-neutral-900 dark:text-neutral-100">
                                                    {formatTanggal(
                                                        item.start_at,
                                                    )}
                                                </div>
                                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {item.location}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        item.status ===
                                                        'published'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                                                            : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-neutral-500">
                                                {item.moderated_at ? (
                                                    <div>
                                                        Diverifikasi:{' '}
                                                        {formatTanggal(
                                                            item.moderated_at,
                                                        )}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {item.status === 'published' ? (
                                                    <button
                                                        onClick={() =>
                                                            handleTakeDown(
                                                                item.id,
                                                                item.title,
                                                            )
                                                        }
                                                        className="rounded px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/50"
                                                    >
                                                        Take-Down
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleRestore(
                                                                item.id,
                                                                item.title,
                                                            )
                                                        }
                                                        className="rounded px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/50"
                                                    >
                                                        Restore
                                                    </button>
                                                )}
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
                                    {events.to ?? 0} dari {events.total}{' '}
                                    kegiatan
                                </div>
                                <div className="flex gap-1">
                                    {events.links.map((link, idx) =>
                                        link.url ? (
                                            <Link
                                                key={idx}
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
                                                key={idx}
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
