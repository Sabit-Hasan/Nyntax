import './LoadingSpinner.scss';

export default function LoadingSpinner() {
    return (
        <>
            <div className="spinner-container">
                <div className="spinner">
                    <div className="double-bounce1"></div>
                    <div className="double-bounce2"></div>
                </div>
                <p> Loading...</p>
            </div>
        </>
    );
}