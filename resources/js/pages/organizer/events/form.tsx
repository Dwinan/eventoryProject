import { Head, Link, useForm } from '@inertiajs/react';
import type { Category } from '@/types/domain';

interface EventData {
    id: number;
    title: string;
    slug: string;
    description: string;
    location: string;
    start_at: string;
    end_at: string;
    quota: number | null;
    poster: string | null;
    status: 'draft' | 'published';
    categories: Category[];
}

interface Props {
    event: EventData | null;
    categories: Category[];
}

export default function Form({ event, categories }: Props) {
    const isEdit = event !== null;

    const { data, setData, post, put, processing, errors } = useForm({
        title: event?.title ?? '',
        slug: event?.slug ?? '',
        description: event?.description ?? '',
        location: event?.location ?? '',
        start_at: event?.start_at ? event.start_at.slice(0, 16) : '',
        end_at: event?.end_at ? event.end_at.slice(0, 16) : '',
        quota: event?.quota ?? '',
        poster: null as File | null,
        poster_url: event?.poster ?? '',
        status: event?.status ?? 'draft',
        categories: event?.categories ? event.categories.map((c) => c.id) : [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? `/organizer/events/${event!.id}`
            : '/organizer/events';
        const method = isEdit ? put : post;
        // poster null = tidak ganti file lama (dihapus di backend update)
        method(url, { forceFormData: true });
    };

    const selectedCategoryIds = new Set(
        Array.isArray(data.categories) ? data.categories : [],
    );

    return (
        <>
            <Head title={isEdit ? 'Edit Event' : 'Buat Event'} />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEdit ? 'Edit Event' : 'Buat Event'}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {isEdit
                            ? 'Perbarui informasi kegiatan ormawa.'
                            : 'Buat kegiatan kampus baru untuk organisasi Anda.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium">
                                Judul Kegiatan
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                placeholder="mis. Pengajian Bersama"
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Slug
                            </label>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={(e) =>
                                    setData('slug', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                placeholder="pengajian-bersama"
                            />
                            {errors.slug && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.slug}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Status
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData(
                                        'status',
                                        e.target.value as 'draft' | 'published',
                                    )
                                }
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium">
                                Deskripsi Kegiatan
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={5}
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                placeholder="Deskripsi lengkap kegiatan..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Waktu Mulai
                            </label>
                            <input
                                type="datetime-local"
                                value={data.start_at}
                                onChange={(e) =>
                                    setData('start_at', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                            {errors.start_at && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.start_at}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Waktu Selesai
                            </label>
                            <input
                                type="datetime-local"
                                value={data.end_at}
                                onChange={(e) =>
                                    setData('end_at', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                            {errors.end_at && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.end_at}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Lokasi
                            </label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) =>
                                    setData('location', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                placeholder="Gedung A, Ruang 101"
                            />
                            {errors.location && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.location}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Kuota Peserta
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={data.quota ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'quota',
                                        e.target.value
                                            ? parseInt(e.target.value, 10)
                                            : 0,
                                    )
                                }
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                placeholder="Kosongkan jika tidak terbatas"
                            />
                            {errors.quota && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.quota}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium">
                                Poster Kegiatan
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setData('poster', file);
                                    if (file) {
                                        setData(
                                            'poster_url',
                                            URL.createObjectURL(file),
                                        );
                                    }
                                }}
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                            {data.poster_url && (
                                <div className="mt-2">
                                    <img
                                        src={data.poster_url}
                                        alt="Preview poster"
                                        className="h-32 w-auto rounded object-cover"
                                    />
                                </div>
                            )}
                            {errors.poster && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.poster}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium">
                                Kategori
                            </label>
                            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {categories.map((c) => (
                                    <label
                                        key={c.id}
                                        className={`flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm ${
                                            selectedCategoryIds.has(c.id)
                                                ? 'border-neutral-900 bg-neutral-900/10 dark:bg-neutral-100/10'
                                                : 'border-neutral-300 dark:border-neutral-700'
                                        }`}
                                    >
                                        <span>{c.name}</span>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategoryIds.has(
                                                c.id,
                                            )}
                                            onChange={(e) => {
                                                const current = Array.isArray(
                                                    data.categories,
                                                )
                                                    ? [...data.categories]
                                                    : [];
                                                const newValues = e.target
                                                    .checked
                                                    ? [...current, c.id]
                                                    : current.filter(
                                                          (id) => id !== c.id,
                                                      );
                                                setData(
                                                    'categories',
                                                    newValues,
                                                );
                                            }}
                                            className="rounded border-neutral-400 text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800"
                                        />
                                    </label>
                                ))}
                            </div>
                            {errors.categories && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.categories}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                        <Link
                            href="/organizer/events"
                            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                            {processing
                                ? 'Menyimpan...'
                                : isEdit
                                  ? 'Perbarui Event'
                                  : 'Buat Event'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
