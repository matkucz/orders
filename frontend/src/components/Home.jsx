import { Link, useNavigate } from "react-router-dom";

export default function Home () {
    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="mt-6 text-center text-3xl">
                    <Link to='/orders'>
                        <button>
                            Start
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}