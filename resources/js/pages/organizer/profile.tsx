import { Head, useForm } from '@inertiajs/react';

interface OrganizationData {
    id: number;
    name: string;
    slug: string;
    type: 'ukm' | 'bem' | 'hmj';
    description: string | null;
    logo: string | null;
    is_active: boolean;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    organization: OrganizationData;
}

export default function Profile({ organization }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: organization.name,
        description: organization.description ?? '',
        logo: organization.logo ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/organizer/profile`, {
            onSuccess: () => {},
        });
    };

    const typeLabels: Record<string, string> = {
        ukm: 'Unit Kegiatan Mahasiswa (UKM)',
        bem: 'Badan Eksekutif Mahasiswa (BEM)',
        hmj: 'Himpunan Mahasiswa Jurusan (HMJ)',
    };

    return (
        <>
            <Head title="Profil Organisasi" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Profil Organisasi
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        Kelola informasi profil ormawa Anda.
                    </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="mb-6 flex items-center gap-4">
                        {organization.logo ? (
                            <img
                                src={organization.logo}
                                alt={organization.name}
                                className="h-20 w-20 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                <svg
                                    className="h-10 w-10 text-neutral-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-semibold">
                                {organization.name}
                            </h2>
                            <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium dark:bg-neutral-800">
                                {typeLabels[organization.type] ??
                                    organization.type}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium">
                                Nama Organisasi
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium">
                                Deskripsi Organisasi
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={4}
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                placeholder="Deskripsi singkat tentang organisasi..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium">
                                Logo (URL Gambar)
                            </label>
                            <input
                                type="url"
                                value={data.logo}
                                onChange={(e) =>
                                    setData('logo', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                placeholder="https://example.com/logo.png"
                            />
                            {errors.logo && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.logo}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <h3 className="text-lg font-semibold">
                        Informasi Akun Organisasi
                    </h3>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm text-neutral-500 dark:text-neutral-400">
                                Email
                            </dt>
                            <dd className="mt-1 text-sm font-medium">
                                {organization.user?.email ?? '-'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-neutral-500 dark:text-neutral-400">
                                Slug
                            </dt>
                            <dd className="mt-1 font-mono text-sm font-medium">
                                {organization.slug}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-neutral-500 dark:text-neutral-400">
                                Status
                            </dt>
                            <dd className="mt-1 text-sm font-medium">
                                <span
                                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                        organization.is_active
                                            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                                            : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                                    }`}
                                >
                                    {organization.is_active
                                        ? 'Aktif'
                                        : 'Nonaktif'}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </>
    );
}
