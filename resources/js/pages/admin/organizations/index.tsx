import { Head, Link, router } from '@inertiajs/react';

interface OrganizationItem {
    id: number;
    name: string;
    slug: string;
    type: 'ukm' | 'bem' | 'hmj';
    is_active: boolean;
    events_count?: number;
    user?: {
        name: string;
        email: string;
    };
}

interface Props {
    organizations: OrganizationItem[];
}

export default function Index({ organizations }: Props) {
    const handleToggle = (id: number) => {
        router.patch(
            `/admin/organizations/${id}/toggle`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (id: number, name: string) => {
        if (
            confirm(
                `Hapus organisasi "${name}"? Akun pengguna terkait juga akan dihapus.`,
            )
        ) {
            router.delete(`/admin/organizations/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const typeBadges: Record<string, string> = {
        ukm: 'UKM',
        bem: 'BEM',
        hmj: 'HMJ',
    };

    return (
        <>
            <Head title="Kelola Organisasi" />
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Kelola Organisasi Mahasiswa
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Daftar akun ormawa aktif dan terdaftar di kampus.
                        </p>
                    </div>
                    <Link
                        href="/admin/organizations/create"
                        className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                        Tambah Organisasi
                    </Link>
                </div>

                {organizations.length === 0 ? (
                    <div className="mt-8 rounded-xl border border-neutral-200 p-12 text-center dark:border-neutral-800">
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Belum ada organisasi mahasiswa yang terdaftar.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Nama Organisasi
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Tipe
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Akun Login
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Total Kegiatan
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status Aktif
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {organizations.map((org) => (
                                        <tr
                                            key={org.id}
                                            className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                        >
                                            <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                                                {org.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-700 uppercase dark:bg-neutral-800 dark:text-neutral-300">
                                                    {typeBadges[org.type] ??
                                                        org.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                                                {org.user?.email ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                                                {org.events_count ?? 0}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() =>
                                                        handleToggle(org.id)
                                                    }
                                                    className={`inline-flex cursor-pointer items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        org.is_active
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                                                            : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                                                    }`}
                                                >
                                                    {org.is_active
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/organizations/${org.id}/edit`}
                                                        className="rounded px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                org.id,
                                                                org.name,
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
                    </div>
                )}
            </div>
        </>
    );
}
