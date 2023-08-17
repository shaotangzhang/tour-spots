import "./index.css";


export default function Footer() {

    return <div className="container text-center pb-4">
        <div className="text-muted" aria-label="Copyright"> Copyright reserved &copy; {window.location.hostname} </div>
    </div>;
};