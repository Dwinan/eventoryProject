import { QRCodeSVG } from 'qrcode.react';

interface EventTicketQRProps {
    token: string;
    eventTitle: string;
    className?: string;
}

export function EventTicketQR({
    token,
    eventTitle,
    className = '',
}: EventTicketQRProps) {
    const ticketUrl = `${window.location.origin}/events/${token}`;

    return (
        <div className={`flex flex-col items-center gap-4 p-4 ${className}`}>
            <div className="rounded-lg bg-white p-4 shadow">
                <QRCodeSVG
                    value={ticketUrl}
                    size={180}
                    level="M"
                    includeMargin={true}
                />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {eventTitle}
                </p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Tunjukkan QR ini saat check-in
                </p>
                <p className="mt-2 font-mono text-xs text-neutral-400 dark:text-neutral-500">
                    {ticketUrl}
                </p>
            </div>
        </div>
    );
}
