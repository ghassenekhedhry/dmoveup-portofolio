import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValue, AnimatePresence } from 'framer-motion';
import Lottie from 'react-lottie-player';
import { Carousel } from './src/components/Carousel';
import { VerticalVideoCard } from './src/components/VerticalVideoCard';
import { VideoModal } from './src/components/VideoModal';
import { getYouTubeThumbnail, isYouTubeUrl } from './src/utils/youtube';
import aiBrainLottieData from './src/assets/lottie/ai-brain.json';

//================================================================================
// 0. ASSET PATHS ORGANIZATION
//================================================================================
const ASSET_PATHS = {
  photos: {
    events: ['/Photos/event_1.jpg', '/Photos/event_2.jpg'],
    nature: ['/Photos/nature_1.jpg'],
    products: ['/Photos/product_1.jpg', '/Photos/product_2.jpg'],
    people: ['/Photos/people_1.jpg']
  },
  videos: {
    reels: ['/Videos-Reels/reel1.mp4', '/Videos-Reels/reel2.mp4', '/Videos-Reels/reel3.mp4'],
    ecom: ['/Videos-Reels/ecom1.mp4', '/Videos-Reels/ecom2.mp4'],
    thumbnails: ['/Videos-Reels/reel1_thumbnail.jpg', '/Videos-Reels/reel2_thumbnail.jpg', '/Videos-Reels/reel3_thumbnail.jpg', '/Videos-Reels/ecom1_thumbnail.jpg', '/Videos-Reels/ecom2_thumbnail.jpg']
  },
  aiVideos: {
    videos: ['/Ai Videos/aivideo1.mp4', '/Ai Videos/aivideo2.mp4', '/Ai Videos/aivideo3.mp4'],
    thumbnails: ['/Ai Videos/aivideo1_thumbnail.jpg', '/Ai Videos/aivideo2_thumbnail.jpg', '/Ai Videos/aivideo3_thumbnail.jpg']
  },
  branding: ['/Branding/stellar-solutions-logo.svg', '/Branding/apex-industries-logo.svg', '/Branding/synergy-co-logo.svg'],
  clients: ['/Clients/stellar-solutions-logo.png', '/Clients/apex-industries-logo.png', '/Clients/synergy-co-logo.png'],
  websites: ['/Websites/dashikidesign.jpg', '/Websites/fadistsarl.jpg', '/Websites/gatheron.jpg', '/Websites/cakesrayen.jpg', '/Websites/amennoomen.jpg'],
  voiceOver: ['/Voice Over/sample1.mp3', '/Voice Over/sample2.mp3'],
  ads: ['/ADS/ad1.jpg', '/ADS/ad2.jpg', '/ADS/ad3.jpg']
};

//================================================================================
// 1. TYPE DEFINITIONS & MOCK DATA
//================================================================================
type SectionId = 'hero' | 'services' | 'portfolio' | 'process' | 'about' | 'clients' | 'contact';
type PortfolioTab = 'websites' | 'video' | 'branding' | 'photography';
type VideoCategory = 'cinematic' | 'ai' | 'ecom';

interface VideoItem {
    id: string;
    title: string;
    category: VideoCategory;
    thumbnail: string;
    videoUrl: string;
    isYouTube?: boolean;
}

const MOCK_DATA = {
    services: [
        { title: "Sponsoring & Ads", description: "Campagnes publicitaires ciblées sur Meta, Google & TikTok pour un ROI maximal." },
        { title: "Développement Web & Mobile", description: "Sites web et applications ultra-performants, optimisés pour la conversion." },
        { title: "Optimisation SEO", description: "Améliorez votre visibilité et dominez les résultats de recherche." },
        { title: "Design & Vidéo", description: "Créations visuelles et contenus vidéo percutants qui captivent votre audience." },
        { title: "Gestion des Réseaux Sociaux", description: "Stratégies de contenu engageantes pour construire et animer votre communauté." },
        { title: "Consulting", description: "Conseils stratégiques pour aligner vos actions marketing avec vos objectifs business." },
    ],
    portfolio: {
        videos: [
            { id: 'cine1', title: "L'Histoire de la Marque", category: 'cinematic' as VideoCategory, thumbnail: ASSET_PATHS.videos.thumbnails[0], videoUrl: ASSET_PATHS.videos.reels[0], isYouTube: false },
            { id: 'cine2', title: "Court-métrage 'Origines'", category: 'cinematic' as VideoCategory, thumbnail: ASSET_PATHS.videos.thumbnails[1], videoUrl: ASSET_PATHS.videos.reels[1], isYouTube: false },
            { id: 'cine3', title: "Pub Produit Révolutionnaire", category: 'cinematic' as VideoCategory, thumbnail: ASSET_PATHS.videos.thumbnails[2], videoUrl: ASSET_PATHS.videos.reels[2], isYouTube: false },
            { id: 'youtube1', title: "Demo YouTube Video", category: 'cinematic' as VideoCategory, thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', isYouTube: true },
            { id: 'ai1', title: "Visualiseur de Données IA", category: 'ai' as VideoCategory, thumbnail: ASSET_PATHS.aiVideos.thumbnails[0], videoUrl: ASSET_PATHS.aiVideos.videos[0], isYouTube: false },
            { id: 'ai2', title: "Animation Logo Générative", category: 'ai' as VideoCategory, thumbnail: ASSET_PATHS.aiVideos.thumbnails[1], videoUrl: ASSET_PATHS.aiVideos.videos[1], isYouTube: false },
            { id: 'ai3', title: "Démo Unboxing IA", category: 'ai' as VideoCategory, thumbnail: ASSET_PATHS.aiVideos.thumbnails[2], videoUrl: ASSET_PATHS.aiVideos.videos[2], isYouTube: false },
            { id: 'ecom1', title: "Publicité Produit High-Tech", category: 'ecom' as VideoCategory, thumbnail: ASSET_PATHS.videos.thumbnails[3], videoUrl: ASSET_PATHS.videos.ecom[0], isYouTube: false },
            { id: 'ecom2', title: "Tutoriel Mode & Beauté", category: 'ecom' as VideoCategory, thumbnail: ASSET_PATHS.videos.thumbnails[4], videoUrl: ASSET_PATHS.videos.ecom[1], isYouTube: false },
        ],
        photos: [
            { id: 1, src: ASSET_PATHS.photos.events[0], title: 'Rêves de Néon', category: 'Événements' },
            { id: 2, src: ASSET_PATHS.photos.nature[0], title: 'Murmure de la Forêt', category: 'Nature' },
            { id: 3, src: ASSET_PATHS.photos.products[0], title: 'Arôme', category: 'Produits' },
            { id: 4, src: ASSET_PATHS.photos.people[0], title: 'Le PDG', category: 'Personnes' },
            { id: 5, src: ASSET_PATHS.photos.events[1], title: 'Conférence Tech', category: 'Événements' },
            { id: 6, src: ASSET_PATHS.photos.products[1], title: 'Artisanat Local', category: 'Produits' },
        ],
        brands: [
            { id: 1, name: "Stellar Solutions", logoUrl: ASSET_PATHS.branding[0], tagline: 'Visez les étoiles.', industry: 'Tech' },
            { id: 2, name: "Apex Industries", logoUrl: ASSET_PATHS.branding[1], tagline: 'La performance au sommet.', industry: 'Industrie' },
            { id: 3, name: "Synergy Co", logoUrl: ASSET_PATHS.branding[2], tagline: 'Plus forts ensemble.', industry: 'Conseil' },
        ],
        websites: [
            { id: 1, name: "Dashiki Design", screenshotUrl: ASSET_PATHS.websites[0], stack: ['Shopify', 'Liquid', 'Custom JS'], client: 'Dashiki Design', url: 'https://www.dashikidesign.com/' },
            { id: 2, name: "Fadist Sarl", screenshotUrl: ASSET_PATHS.websites[1], stack: ['WordPress', 'Elementor', 'PHP'], client: 'Fadist Sarl', url: 'https://www.fadistsarl.com/' },
            { id: 3, name: "GatherOn", screenshotUrl: ASSET_PATHS.websites[2], stack: ['React', 'Next.js', 'Tailwind CSS'], client: 'GatherOn', url: 'https://gatheron.ae/' },
            { id: 4, name: "Cakes Rayen", screenshotUrl: ASSET_PATHS.websites[3], stack: ['Wix', 'Velo by Wix'], client: 'Cakes Rayen', url: 'https://www.cakesrayen.com/' },
            { id: 5, name: "Amen Noomen", screenshotUrl: ASSET_PATHS.websites[4], stack: ['React', 'Framer Motion', 'Three.js'], client: 'Amen Noomen', url: 'https://amennoomen.com/' },
        ]
    },
    processSteps: [
        { number: 1, title: 'Découverte & Stratégie', description: "Nous analysons vos besoins et définissons des objectifs clairs et mesurables." },
        { number: 2, title: 'Création & Développement', description: "Nos experts conçoivent et développent des solutions créatives et techniques sur mesure." },
        { number: 3, title: 'Déploiement & Lancement', description: "Nous orchestrons le lancement de vos projets avec précision pour un impact maximal." },
        { number: 4, title: 'Analyse & Optimisation', description: "Nous suivons les KPIs et optimisons en continu pour garantir des performances durables." },
    ],
    testimonials: [
        { quote: "Une transformation digitale incroyable. Notre ROI a augmenté de 200% en 6 mois.", author: "Alice Martin", company: "Stellar Solutions", logo: ASSET_PATHS.clients[0] },
        { quote: "L'équipe de Digital Move Up est réactive, créative et incroyablement efficace.", author: "Julien Dubois", company: "Apex Industries", logo: ASSET_PATHS.clients[1] },
        { quote: "Leur approche basée sur la data a complètement changé notre stratégie marketing.", author: "Chloé Lambert", company: "Synergy Co", logo: ASSET_PATHS.clients[2] },
    ]
};

//================================================================================
// 2. SVG ICON COMPONENTS
//================================================================================
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>;
const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>;
const LayersIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24"><path fill="currentColor" d="M16.6,14.2l-1.5-0.8c-0.4-0.2-0.7-0.1-1,0.2l-0.6,0.7c-1.3-0.7-2.5-1.9-3.2-3.2l0.7-0.6c0.3-0.3,0.4-0.6,0.2-1l-0.8-1.5c-0.2-0.4-0.6-0.5-1-0.3l-1.4,0.6c-0.4,0.2-0.7,0.6-0.7,1.1c0,2.9,2.4,5.3,5.3,5.3c0.5,0,0.9-0.3,1.1-0.7L16.9,15.2C17.1,14.8,17,14.4,16.6,14.2z M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.5,0,10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z"/></svg>;
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const LogoIcon = () => <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-mint to-brand-purple">DMU</div>;
const SunIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;

//================================================================================
// 3. LAYOUT & NAVIGATION COMPONENTS
//================================================================================
const SectionWrapper = React.forwardRef<HTMLElement, { children: React.ReactNode, id: SectionId, className?: string }>(({ children, id, className = "" }, ref) => (
    <section 
        ref={ref} 
        id={id} 
        className={`min-h-screen w-full flex flex-col justify-center items-center scroll-section ${className}`}
    >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 max-w-7xl">
            {children}
        </div>
    </section>
));

const NavbarTop = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto flex justify-between items-center bg-white/50 dark:bg-black/30 backdrop-blur-lg p-3 rounded-2xl border border-black/10 dark:border-white/10">
            <a href="#hero" className="flex items-center gap-3">
                <LogoIcon />
                <span className="font-extrabold text-lg hidden sm:block">Digital Move Up</span>
            </a>
            <div className="flex items-center gap-4">
                <a href="#contact" className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-brand-mint to-brand-purple text-black rounded-lg transition-transform hover:scale-105">
                    Parler à un expert
                </a>
                <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-white/10 transition-colors">
                    {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-gray-800" />}
                </button>
            </div>
        </div>
    </header>
);

const Dock = ({ activeSection }: { activeSection: SectionId }) => {
    const mouseX = useMotionValue(Infinity);
    const navItems: { id: SectionId, label: string, icon: React.ComponentType<any> }[] = [
        { id: 'hero', label: 'Accueil', icon: HomeIcon },
        { id: 'services', label: 'Services', icon: LayersIcon },
        { id: 'portfolio', label: 'Portfolio', icon: CameraIcon },
        { id: 'process', label: 'Processus', icon: TrendingUpIcon },
        { id: 'about', label: 'À Propos', icon: UsersIcon },
        { id: 'clients', label: 'Clients', icon: MessageSquareIcon },
        { id: 'contact', label: 'Contact', icon: MailIcon },
    ];

    return (
        <nav 
            onMouseMove={(e) => mouseX.set(e.nativeEvent.x)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex h-16 items-end gap-2 rounded-2xl bg-white/50 dark:bg-black/30 backdrop-blur-lg px-4 pb-3 border border-black/10 dark:border-white/10"
        >
            {navItems.map(({ id, label, icon: Icon }) => {
                const ref = useRef<HTMLAnchorElement>(null);
                const distance = useTransform(mouseX, (val) => {
                    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
                    return val - bounds.x - bounds.width / 2;
                });
                const scale = useTransform(distance, [-150, 0, 150], [1, 1.5, 1], { clamp: true });

                return (
                    <a href={`#${id}`} key={id} ref={ref} className="group relative">
                        <motion.div
                            style={{ scale }}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ${activeSection === id ? 'bg-brand-mint text-black' : 'bg-gray-200 dark:bg-white/10 text-brand-text-light dark:text-white hover:bg-gray-300 dark:hover:bg-white/20'}`}
                        >
                            <Icon className="w-5 h-5" />
                        </motion.div>
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 text-xs bg-black/80 text-white rounded-md whitespace-nowrap">
                            {label}
                        </div>
                    </a>
                );
            })}
        </nav>
    );
};

const FloatingButtons = () => (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-3">
        <a href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
            <WhatsAppIcon className="w-7 h-7" />
        </a>
    </div>
);

const SectionTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`w-full text-center mb-8 sm:mb-12 lg:mb-16 ${className}`}>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            {children}
        </h2>
    </div>
);

//================================================================================
// 4. SECTION COMPONENTS
//================================================================================

// 4.1. Hero Section
const HeroSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="hero" className="relative">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-20" style={{ backgroundImage: `url('/assets/hero-background.jpg')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg-light dark:from-brand-bg-dark via-brand-bg-light/80 dark:via-brand-bg-dark/80 to-transparent" />
        <div className="relative text-center z-10 w-full">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6"
            >
                <span className="text-gray-700 dark:text-gray-300">Votre marketing. </span>
                <br className="sm:hidden" />
                <span className="bg-gradient-to-r from-brand-mint to-brand-purple bg-clip-text text-transparent animate-text-gradient bg-[200%_auto]">
                    Plus intelligent.
                </span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 sm:mb-10"
            >
                Nous fusionnons la créativité avec la précision de l'IA pour booster votre croissance.
            </motion.p>
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6"
            >
                <a href="#contact" className="w-full sm:w-auto px-8 py-4 font-bold bg-brand-text-light dark:bg-white text-brand-bg-light dark:text-black rounded-lg transition-transform hover:scale-105 text-center">
                    Parler à un expert
                </a>
                <a href="#portfolio" className="w-full sm:w-auto px-8 py-4 font-bold text-brand-text-light dark:text-white bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/20 text-center">
                    Voir nos travaux ↓
                </a>
            </motion.div>
        </div>
    </SectionWrapper>
));

// 4.2. Services Section
const ServicesSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="services">
        <SectionTitle>
            Nos <span className="text-brand-mint">Services</span>
        </SectionTitle>
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {MOCK_DATA.services.map((service, index) => (
                    <motion.div
                        key={service.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className="bg-gray-50/50 dark:bg-white/5 p-6 lg:p-8 rounded-xl border border-black/10 dark:border-white/10 hover:border-brand-mint/50 transition-colors h-full flex flex-col"
                    >
                        <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-4 text-brand-mint">
                            {service.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg flex-grow">
                            {service.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    </SectionWrapper>
));

// 4.3. Portfolio Section
const PortfolioSection = React.forwardRef<HTMLElement, {}>((props, ref) => {
    const [activeTab, setActiveTab] = useState<PortfolioTab>('websites');
    const [videoCategory, setVideoCategory] = useState<VideoCategory>('cinematic');
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

    const tabs: {id: PortfolioTab, label: string, icon: React.ComponentType<any>}[] = [
        { id: 'websites', label: 'Sites Web', icon: GlobeIcon },
        { id: 'video', label: 'Vidéo', icon: VideoIcon },
        { id: 'branding', label: 'Branding', icon: LayersIcon },
        { id: 'photography', label: 'Photo', icon: CameraIcon },
    ];

    const videoCategories: {id: VideoCategory, label: string}[] = [
        { id: 'cinematic', label: 'Cinematic' },
        { id: 'ai', label: 'AI' },
        { id: 'ecom', label: 'E-commerce' },
    ];

    return (
        <SectionWrapper ref={ref} id="portfolio">
            <SectionTitle>
                Voir nos <span className="text-brand-purple">travaux</span>
            </SectionTitle>
            <div className="w-full">
                {/* Tab Navigation */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id)} 
                            className={`px-4 py-2 text-sm font-bold rounded-lg border transition-colors flex items-center gap-2 ${
                                activeTab === tab.id 
                                    ? 'bg-brand-purple text-white border-brand-purple' 
                                    : 'border-black/10 dark:border-white/20 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Video Category Sub-navigation */}
                <AnimatePresence>
                    {activeTab === 'video' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8"
                        >
                            {videoCategories.map(cat => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => setVideoCategory(cat.id)} 
                                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                                        videoCategory === cat.id 
                                            ? 'bg-brand-mint text-black' 
                                            : 'bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content Area */}
                <div className="w-full min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeTab}-${videoCategory}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            {activeTab === 'websites' && (
                                <Carousel itemsPerView={3} className="w-full" autoScroll={true} autoScrollDelay={5000}>
                                    {MOCK_DATA.portfolio.websites.map(site => (
                                        <a 
                                            href={site.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            key={site.id} 
                                            className="group bg-gray-50/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden hover:border-brand-purple/50 transition-all duration-300 p-4 lg:p-6 flex flex-col h-full"
                                        >
                                            <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden">
                                                <img 
                                                    src={site.screenshotUrl} 
                                                    alt={site.name} 
                                                    className="w-full h-full object-cover border border-black/10 dark:border-white/10 group-hover:scale-105 transition-transform duration-300" 
                                                />
                                            </div>
                                            <h3 className="font-bold text-lg lg:text-xl mb-2">{site.name}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{site.client}</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {site.stack.map(tech => (
                                                    <span key={tech} className="text-xs bg-gray-200 dark:bg-white/10 px-2 py-1 rounded-full">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 text-brand-purple font-bold group-hover:underline text-sm mt-auto">
                                                Visiter le Site <ArrowRightIcon className="w-4 h-4" />
                                            </div>
                                        </a>
                                    ))}
                                </Carousel>
                            )}
                            
                            {activeTab === 'video' && (
                                <>
                                    <Carousel itemsPerView={4} className="w-full" autoScroll={true} autoScrollDelay={3000}>
                                        {MOCK_DATA.portfolio.videos.filter(v => v.category === videoCategory).map(video => (
                                            <VerticalVideoCard
                                                key={video.id}
                                                video={video}
                                                onClick={() => setSelectedVideo(video)}
                                            />
                                        ))}
                                    </Carousel>
                                    <VideoModal
                                        isOpen={!!selectedVideo}
                                        onClose={() => setSelectedVideo(null)}
                                        videoUrl={selectedVideo?.videoUrl || ''}
                                        title={selectedVideo?.title || ''}
                                    />
                                </>
                            )}
                            
                            {activeTab === 'branding' && (
                                <Carousel itemsPerView={3} className="w-full" autoScroll={true} autoScrollDelay={4500}>
                                    {MOCK_DATA.portfolio.brands.map(brand => (
                                        <div 
                                            key={brand.id} 
                                            className="bg-gray-50/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 lg:p-8 flex flex-col justify-center items-center text-center aspect-square hover:border-brand-purple/50 transition-all duration-300 group"
                                        >
                                            <div className="h-12 lg:h-16 mb-4 lg:mb-6 flex items-center justify-center">
                                                <img 
                                                    src={brand.logoUrl} 
                                                    alt={`${brand.name} Logo`} 
                                                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                            <h3 className="font-bold text-lg lg:text-xl mb-2">{brand.name}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 italic text-sm lg:text-base">
                                                "{brand.tagline}"
                                            </p>
                                        </div>
                                    ))}
                                </Carousel>
                            )}
                            
                            {activeTab === 'photography' && (
                                <Carousel itemsPerView={3} className="w-full" autoScroll={true} autoScrollDelay={4000}>
                                    {MOCK_DATA.portfolio.photos.map(photo => (
                                        <div 
                                            key={photo.id} 
                                            className="group relative overflow-hidden rounded-xl aspect-[4/5] border border-black/10 dark:border-white/10 hover:border-brand-mint/50 transition-all duration-300"
                                        >
                                            <img 
                                                src={photo.src} 
                                                alt={photo.title} 
                                                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <div>
                                                    <h3 className="text-white font-bold text-lg mb-1">
                                                        {photo.title}
                                                    </h3>
                                                    <p className="text-gray-300 text-sm">
                                                        {photo.category}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Carousel>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </SectionWrapper>
    );
});

// 4.4. Process Section
const ProcessSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="process">
        <SectionTitle>
            Notre <span className="text-brand-mint">Méthodologie</span>
        </SectionTitle>
        <div className="w-full max-w-4xl mx-auto">
            <div className="space-y-8 lg:space-y-12">
                {MOCK_DATA.processSteps.map((step, index) => (
                    <motion.div
                        key={step.number}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                        viewport={{ once: true, amount: 0.6 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-8"
                    >
                        <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 dark:bg-white/5 border-2 border-brand-mint rounded-full flex items-center justify-center mx-auto sm:mx-0">
                            <span className="text-xl lg:text-2xl font-extrabold text-brand-mint">
                                {`0${step.number}`}
                            </span>
                        </div>
                        <div className="text-center sm:text-left flex-grow">
                            <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl text-brand-text-light dark:text-white mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-xl">
                                {step.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </SectionWrapper>
));

// 4.5. About Section
const AboutSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="about">
        <SectionTitle>
            Pourquoi <span className="text-brand-purple">Digital Move Up</span>
        </SectionTitle>
        <div className="w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="text-center lg:text-left order-2 lg:order-1">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-6">
                        Notre Mission
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg sm:text-xl lg:text-2xl leading-relaxed">
                        Nous fusionnons passion créative et précision de l'IA pour aider les marques à naviguer dans le paysage numérique et à atteindre une croissance exponentielle.
                    </p>
                    <h4 className="font-extrabold text-xl sm:text-2xl mb-6">Nos Valeurs:</h4>
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                        {['Innovation', 'Transparence', 'Performance', 'Partenariat'].map(value => (
                            <span 
                                key={value} 
                                className="text-sm sm:text-base font-medium bg-gray-200 dark:bg-white/10 px-4 py-2 rounded-full"
                            >
                                {value}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center order-1 lg:order-2">
                    <div className="w-full max-w-sm lg:max-w-md">
                        <Lottie
                            loop
                            animationData={aiBrainLottieData}
                            play
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4 text-center text-sm sm:text-base">
                        Propulsé par Imed, notre noyau IA.
                    </p>
                </div>
            </div>
        </div>
    </SectionWrapper>
));

// 4.6. Clients Section
const ClientsSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="clients">
        <SectionTitle>
            Nos <span className="text-brand-mint">Clients</span>
        </SectionTitle>
        <div className="w-full">
            <Carousel itemsPerView={3} className="w-full" autoScroll={true} autoScrollDelay={6000}>
                {MOCK_DATA.testimonials.map((testimonial, index) => (
                    <motion.div 
                        key={testimonial.author}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className="bg-gray-50/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 lg:p-8 flex flex-col justify-center backdrop-blur-sm h-full min-h-[300px] hover:border-brand-mint/50 transition-all duration-300 group"
                    >
                        <p className="text-base lg:text-lg italic mb-6 leading-relaxed flex-grow">
                            "{testimonial.quote}"
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/80 p-2 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <img 
                                    src={testimonial.logo} 
                                    alt={`${testimonial.company} logo`} 
                                    className="w-full h-full object-contain" 
                                />
                            </div>
                            <div>
                                <p className="font-bold text-brand-text-light dark:text-white text-base lg:text-lg">
                                    {testimonial.author}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {testimonial.company}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </Carousel>
        </div>
    </SectionWrapper>
));

// 4.7. Contact Section
const ContactSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="contact">
        <SectionTitle>
            Parlons de votre <span className="text-brand-purple">projet</span>
        </SectionTitle>
        <div className="w-full max-w-lg mx-auto">
            <div className="bg-gray-50/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-8 lg:p-10 backdrop-blur-sm">
                <form className="space-y-6">
                    <input 
                        type="text" 
                        placeholder="Votre Nom" 
                        className="w-full bg-gray-100 dark:bg-white/5 p-4 rounded-lg border border-black/10 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-purple text-base sm:text-lg" 
                    />
                    <input 
                        type="email" 
                        placeholder="Votre Email" 
                        className="w-full bg-gray-100 dark:bg-white/5 p-4 rounded-lg border border-black/10 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-purple text-base sm:text-lg" 
                    />
                    <textarea 
                        placeholder="Votre Message" 
                        rows={5} 
                        className="w-full bg-gray-100 dark:bg-white/5 p-4 rounded-lg border border-black/10 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-purple text-base sm:text-lg resize-none"
                    ></textarea>
                    <button 
                        type="submit" 
                        className="w-full p-4 font-bold bg-gradient-to-r from-brand-mint to-brand-purple text-black rounded-lg transition-transform hover:scale-105 text-base sm:text-lg"
                    >
                        Envoyer le Message
                    </button>
                </form>
                <div className="text-center my-6 text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                    OU
                </div>
                <a 
                    href="https://calendly.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block w-full text-center p-4 font-bold bg-gray-200 dark:bg-white/10 border border-black/10 dark:border-white/20 text-brand-text-light dark:text-white rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-white/20 text-base sm:text-lg"
                >
                    Réserver un appel sur Calendly
                </a>
            </div>
        </div>
    </SectionWrapper>
));

//================================================================================
// 5. MAIN APP COMPONENT
//================================================================================
export default function App() {
    const [activeSection, setActiveSection] = useState<SectionId>('hero');
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });
    
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    const sectionIds: SectionId[] = ['hero', 'services', 'portfolio', 'process', 'about', 'clients', 'contact'];
    
    const refs = {
        hero: useRef<HTMLElement>(null),
        services: useRef<HTMLElement>(null),
        portfolio: useRef<HTMLElement>(null),
        process: useRef<HTMLElement>(null),
        about: useRef<HTMLElement>(null),
        clients: useRef<HTMLElement>(null),
        contact: useRef<HTMLElement>(null),
    };

    const inViewHooks = {
        hero: useInView(refs.hero, { amount: 0.5 }),
        services: useInView(refs.services, { amount: 0.5 }),
        portfolio: useInView(refs.portfolio, { amount: 0.5 }),
        process: useInView(refs.process, { amount: 0.5 }),
        about: useInView(refs.about, { amount: 0.5 }),
        clients: useInView(refs.clients, { amount: 0.5 }),
        contact: useInView(refs.contact, { amount: 0.5 }),
    };

    useEffect(() => {
        const visibleSections = sectionIds.filter(id => inViewHooks[id]);
        if (visibleSections.length > 0) {
            setActiveSection(visibleSections[visibleSections.length - 1]);
        }
    }, [inViewHooks.hero, inViewHooks.services, inViewHooks.portfolio, inViewHooks.process, inViewHooks.about, inViewHooks.clients, inViewHooks.contact]);

    return (
        <>
            <NavbarTop theme={theme} toggleTheme={toggleTheme} />
            <main>
                <HeroSection ref={refs.hero} />
                <ServicesSection ref={refs.services} />
                <PortfolioSection ref={refs.portfolio} />
                <ProcessSection ref={refs.process} />
                <AboutSection ref={refs.about} />
                <ClientsSection ref={refs.clients} />
                <ContactSection ref={refs.contact} />
            </main>
            <Dock activeSection={activeSection} />
            <FloatingButtons />
        </>
    );
}