import { ClipLoader } from "react-spinners";

function LoadingSpinner() {

    return (
        <div className="min-h-screen flex items-center justify-center">
            <ClipLoader
                color="#0f172a"
                size={50}
            />
        </div>
    );
}
export default LoadingSpinner;