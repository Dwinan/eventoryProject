import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    events_count?: number;
}

interface Props {
    categories: CategoryItem[];
}

export default function Index({ categories }: Props) {
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
        null,
    );

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/admin/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setEditingCategory(null);
                    reset('name');
                },
            });
        } else {
            post('/admin/categories', {
                onSuccess: () => {
                    reset('name');
                },
            });
        }
    };

    const startEdit = (cat: CategoryItem) => {
        setEditingCategory(cat);
        setData('name', cat.name);
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        reset('name');
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Hapus kategori "${name}"?`)) {
            router.delete(`/admin/categories/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Kelola Kategori" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Kategori Kegiatan Kampus
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        Kelola data master kategori kegiatan kampus.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 lg:col-span-1 dark:border-neutral-800 dark:bg-neutral-950">
                        <h2 className="text-base font-semibold">
                            {editingCategory
                                ? 'Edit Kategori'
                                : 'Tambah Kategori'}
                        </h2>
                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="cat_name"
                                    className="block text-sm font-medium"
                                >
                                    Nama Kategori
                                </label>
                                <input
                                    id="cat_name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="mis. Seminar, Workshop, Seni"
                                    className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {editingCategory && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                                    >
                                        Batal
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing || !data.name.trim()}
                                    className="flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : editingCategory
                                          ? 'Perbarui'
                                          : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white lg:col-span-2 dark:border-neutral-800 dark:bg-neutral-950">
                        {categories.length === 0 ? (
                            <div className="p-8 text-center text-sm text-neutral-500">
                                Belum ada kategori yang dibuat.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">
                                                Nama
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Slug
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Jumlah Event
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                        {categories.map((cat) => (
                                            <tr
                                                key={cat.id}
                                                className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                            >
                                                <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                                                    {cat.name}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                                                    {cat.slug}
                                                </td>
                                                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                                                    {cat.events_count ?? 0}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                startEdit(cat)
                                                            }
                                                            className="rounded px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    cat.id,
                                                                    cat.name,
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
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
