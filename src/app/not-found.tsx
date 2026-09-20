import Link from 'next/link';

export const metadata = {
  title: '404 - Page Not Found — TELECASH',
};

export default function NotFound() {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto space-y-4">
      <div className="text-6xl font-extrabold text-brand-600">404</div>
      <h1 className="text-2xl font-bold text-gray-900">Screen Not Found</h1>
      <p className="text-sm text-gray-500">
        The requested financial route does not exist or has been relocated.
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition shadow-sm"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
