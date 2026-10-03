import type { Metadata } from 'next';
import content from '@/lib/imported-content.json';
export const metadata: Metadata={title:'Terms and Conditions'};
export default function Terms(){return <main id="main" className="section"><div className="container"><article className="prose legal-prose" dangerouslySetInnerHTML={{__html:content['terms-and-conditions']}}/></div></main>}
