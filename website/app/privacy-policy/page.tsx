import type { Metadata } from 'next';
import content from '@/lib/imported-content.json';
export const metadata: Metadata={title:'Privacy Policy'};
export default function Privacy(){return <main id="main" className="section"><div className="container"><article className="prose legal-prose" dangerouslySetInnerHTML={{__html:content['privacy-policy']}}/></div></main>}
