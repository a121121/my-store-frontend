// components/ui/error-message.tsx
interface ErrorMessageProps {
    title: string;
    message: string;
    retry?: () => void;
}

export function ErrorMessage({ title, message, retry }: ErrorMessageProps) {
    return (
        <div className="mx-auto max-w-md p-4 text-center">
            <h3 className="text-lg font-medium text-red-600">{title}</h3>
            <p className="mt-2 text-gray-600">{message}</p>
            {retry && (
                <button
                    onClick={retry}
                    className="mt-4 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                    Retry
                </button>
            )}
        </div>
    );
}