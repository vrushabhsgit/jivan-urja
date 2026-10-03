import Link from 'next/link';
export default function NotFound(){return <main id="main" className="not-found"><span className="eyebrow justify-center">404 · PAGE NOT FOUND</span><h1 className="text-5xl mb-5">Let’s find your way back.</h1><p>The page you’re looking for could not be found.</p><Link href="/" className="button mt-5">Back to home</Link></main>}
