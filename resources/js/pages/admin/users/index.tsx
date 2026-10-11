import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import type { PaginatedData, User } from '@/types/domain';

interface Props {
    users: PaginatedData<User>;
    filters: {
        search?: string;
        role?: string;
    };
}

export default function Index({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? '');
    const [processing, setProcessing] = useState(false);

    const applyFilters = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        router.get(
            '/admin/users',
            { search, role },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['users', 'filters'],
                onFinish: () => setProcessing(false),
            },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setRole('');
        setProcessing(true);
        router.get(
            '/admin/users',
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['users', 'filters'],
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Hapus pengguna "${name}"?`)) {
            router.delete(`/admin/users/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const roleBadgeStyles: Record<string, string> = {
        administrator:
            'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
        organizer:
            'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
        general:
            'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300',
    };

    return (
        <>
            <Head title="Kelola Pengguna" />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Kelola Pengguna Kampus
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Kelola akun mahasiswa, organizer ormawa, dan
                            administrator.
                        </p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                        Tambah Pengguna
                    </Link>
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
                            Cari Pengguna
                        </label>
                        <input
                            id="search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Nama atau email..."
                            className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        />
                    </div>

                    <div className="w-full sm:w-48">
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium"
                        >
                            Peran Akses (Role)
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        >
                            <option value="">Semua Role</option>
                            <option value="general">Mahasiswa (General)</option>
                            <option value="organizer">
                                Ormawa (Organizer)
                            </option>
                            <option value="administrator">Administrator</option>
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

                {users.data.length === 0 ? (
                    <div className="mt-8 rounded-xl border border-neutral-200 p-12 text-center dark:border-neutral-800">
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Tidak ada pengguna yang cocok dengan filter.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Nama
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Role
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                        >
                                            <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                                        roleBadgeStyles[
                                                            user.role
                                                        ] ??
                                                        'bg-neutral-100 text-neutral-800'
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className="rounded px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id,
                                                                user.name,
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

                        {users.links.length > 3 && (
                            <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
                                <div className="text-xs text-neutral-500">
                                    Menampilkan {users.from ?? 0} sampai{' '}
                                    {users.to ?? 0} dari {users.total} pengguna
                                </div>
                                <div className="flex gap-1">
                                    {users.links.map((link, idx) =>
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
