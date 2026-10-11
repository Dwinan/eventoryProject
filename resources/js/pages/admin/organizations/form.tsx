import { Head, Link, useForm } from '@inertiajs/react';

interface OrganizationData {
    id: number;
    name: string;
    type: 'ukm' | 'bem' | 'hmj';
    description: string | null;
    logo: string | null;
    user?: {
        email: string;
    };
}

interface Props {
    organization: OrganizationData | null;
}

export default function Form({ organization }: Props) {
    const isEdit = organization !== null;

    const { data, setData, post, put, processing, errors } = useForm({
        name: organization?.name ?? '',
        type: organization?.type ?? 'ukm',
        email: organization?.user?.email ?? '',
        description: organization?.description ?? '',
        logo: organization?.logo ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/organizations/${organization.id}`);
        } else {
            post('/admin/organizations');
        }
    };

    return (
        <>
            <Head
                title={
                    isEdit ? 'Edit Organisasi' : 'Tambah Organisasi Mahasiswa'
                }
            />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEdit
                            ? 'Edit Organisasi'
                            : 'Tambah Organisasi Mahasiswa'}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {isEdit
                            ? 'Perbarui informasi organisasi mahasiswa.'
                            : 'Daftarkan entitas ormawa baru beserta akun login.'}
                    </p>
                </div>

                <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium"
                            >
                                Nama Organisasi
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="mis. BEM Universitas Lampung"
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {!isEdit && (
                            <>
                                <div>
                                    <label
                                        htmlFor="type"
                                        className="block text-sm font-medium"
                                    >
                                        Tipe Organisasi
                                    </label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) =>
                                            setData(
                                                'type',
                                                e.target.value as
                                                    | 'ukm'
                                                    | 'bem'
                                                    | 'hmj',
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                    >
                                        <option value="ukm">
                                            UKM (Unit Kegiatan Mahasiswa)
                                        </option>
                                        <option value="bem">
                                            BEM (Badan Eksekutif Mahasiswa)
                                        </option>
                                        <option value="hmj">
                                            HMJ (Himpunan Mahasiswa Jurusan)
                                        </option>
                                    </select>
                                    {errors.type && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.type}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium"
                                    >
                                        Email Akun Ormawa
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="ormawa@kampus.ac.id"
                                        className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        <div>
                            <label
                                htmlFor="logo"
                                className="block text-sm font-medium"
                            >
                                URL Logo (Opsional)
                            </label>
                            <input
                                id="logo"
                                type="url"
                                value={data.logo}
                                onChange={(e) =>
                                    setData('logo', e.target.value)
                                }
                                placeholder="https://example.com/logo.png"
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                            {errors.logo && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.logo}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium"
                            >
                                Deskripsi Profil Ormawa
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Profil singkat kegiatan ormawa..."
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                            <Link
                                href="/admin/organizations"
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
                                      ? 'Perbarui Organisasi'
                                      : 'Simpan Organisasi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
