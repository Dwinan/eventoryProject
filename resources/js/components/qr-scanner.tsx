'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface QRScannerProps {
    onScan: (token: string) => void;
    className?: string;
}

export default function QRScanner({ onScan, className = '' }: QRScannerProps) {
    const [scanning, setScanning] = useState(false);
    const [hasCamera, setHasCamera] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<HTMLDivElement>(null);
    const html5QrcodeRef = useRef<Html5QrcodeScanner | null>(null);

    const checkCameraPermission = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            stream.getTracks().forEach(track => track.stop());
            setHasCamera(true);
        } catch {
            setHasCamera(false);
            setError('Akses kamera ditolak atau tidak tersedia. Gunakan input manual di samping.');
        }
    }, []);

    const startScanner = useCallback(() => {
        if (!scannerRef.current || html5QrcodeRef.current) return;

        const scanner = new Html5QrcodeScanner(
            'qr-scanner',
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                rememberLastUsedCamera: true,
                showTorchButtonIfSupported: true,
                showZoomSliderIfSupported: true,
            },
            /* verbose= */ false
        );

        scanner.render(
            (decodedText: string) => {
                if (decodedText.trim()) {
                    onScan(decodedText.trim());
                    setScanning(false);
                    scanner.clear().catch(() => {});
                    html5QrcodeRef.current = null;
                }
            },
            (errorMessage: string) => {
                // ignore scan errors (noise, etc)
            }
        );

        html5QrcodeRef.current = scanner;
        setScanning(true);
        setError(null);
    }, [onScan]);

    const stopScanner = useCallback(() => {
        if (html5QrcodeRef.current) {
            html5QrcodeRef.current.clear().catch(() => {});
            html5QrcodeRef.current = null;
        }
        setScanning(false);
    }, []);

    useEffect(() => {
        checkCameraPermission();
        return () => stopScanner();
    }, [checkCameraPermission, stopScanner]);

    useEffect(() => {
        if (scanning && hasCamera && scannerRef.current && !html5QrcodeRef.current) {
            startScanner();
        }
        return () => stopScanner();
    }, [scanning, hasCamera, startScanner, stopScanner]);

    return (
        <div className={`rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950 ${className}`}>
            <h2 className="text-base font-semibold">Scanner QR Kamera</h2>

            {error && !hasCamera ? (
                <div className="mt-4 p-3 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-sm">
                    {error}
                </div>
            ) : (
                <>
                    {!scanning && hasCamera && (
                        <button
                            type="button"
                            onClick={() => setScanning(true)}
                            className="mt-4 w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                            Buka Kamera & Mulai Scan
                        </button>
                    )}

                    {scanning && (
                        <div className="mt-4">
                            <div id="qr-scanner" ref={scannerRef} style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }} />
                            <p className="mt-2 text-center text-sm text-neutral-500">
                                Arahkan kamera ke QR code tiket peserta
                            </p>
                            <button
                                type="button"
                                onClick={() => setScanning(false)}
                                className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
                            >
                                Batalkan Scan
                            </button>
                        </div>
                    )}

                    {!hasCamera && !error && (
                        <div className="mt-4 text-center text-sm text-neutral-500">
                            Periksa izin kamera browser untuk menggunakan scanner.
                        </div>
                    )}
                </>
            )}
        </div>
    );
}