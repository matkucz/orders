import { useParams } from "react-router-dom";

export default function Order() {
    const params = useParams();
    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="mt-6 text-center text-3xl">
                    Your order number:
                    <p className="underline decoration-sky-500">
                        {params.orderId}
                    </p>
                </div>
            </div>
        </div>
    )
}