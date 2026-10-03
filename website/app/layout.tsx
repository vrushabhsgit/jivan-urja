import type { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Motion from '@/components/motion';
import './globals.css';
import './motion.css';
import './fonts.css';
import './design.css';
export const metadata: Metadata = {title:{default:'Jivan Urja | Ayurvedic Knee & Joint Care in Pune',template:'%s | Jivan Urja'},description:'Personalized Ayurvedic knee and joint care in Pune. Meet our BAMS-qualified practitioners and begin your wellness journey at Jivan Urja Chikitsalaya.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<Footer/><Motion/></body></html>}
