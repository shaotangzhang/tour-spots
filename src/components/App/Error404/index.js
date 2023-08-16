export default function Error404({ children }) {

    return <div className="container text-center p-5">
        <p className="display-1">404</p>
        <h1 className="text-muted">{children || 'Page is not found.'}</h1>
    </div>
}