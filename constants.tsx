import type { NavLink, Service, PortfolioItem, Client, Value } from './types';

export const NAV_LINKS: NavLink[] = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About Us' },
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#vision', label: 'Our Vision' },
  { href: '#contact', label: 'Contact Us' },
];

export const SERVICES: Service[] = [
  {
    icon: 'fas fa-bullhorn',
    title: 'Digital Marketing Services',
    description: 'Comprehensive strategies to strengthen brand identity and maximize ROI.',
    items: ['Social media management', 'Paid advertising campaigns', 'Content marketing', 'Integrated marketing campaigns'],
  },
  {
    icon: 'fas fa-camera-retro',
    title: 'Production & Media',
    description: 'High-quality media production to bring your brand\'s story to life.',
    items: ['Professional photography', 'Commercial video production', 'Video editing & post-production', 'Event coverage & management'],
  },
  {
    icon: 'fas fa-code',
    title: 'Tech Solutions',
    description: 'Integrated solutions to support your digital presence and business needs.',
    items: ['Website design & development', 'Mobile app development', 'Custom IT solutions', 'Web hosting & cybersecurity'],
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
    { id: 1, imageUrl: 'https://picsum.photos/seed/p1/600/400', title: 'Brand Identity', category: 'Marketing', type: 'image' },
    { id: 2, imageUrl: 'https://picsum.photos/seed/p2/600/400', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-marketing-and-digital-media-34444-large.mp4', title: 'Promotional Video', category: 'Media', type: 'video' },
    { id: 3, imageUrl: 'https://picsum.photos/seed/p3/600/400', title: 'E-commerce Website', category: 'Tech', type: 'image' },
    { id: 4, imageUrl: 'https://picsum.photos/seed/p4/600/400', title: 'Mobile Application', category: 'Tech', type: 'image' },
    { id: 5, imageUrl: 'https://picsum.photos/seed/p5/600/400', title: 'Social Media Campaign', category: 'Marketing', type: 'image' },
    { id: 6, imageUrl: 'https://picsum.photos/seed/p6/600/400', title: 'Corporate Photography', category: 'Media', type: 'image' },
    { id: 7, imageUrl: 'https://picsum.photos/seed/p7/600/400', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-a-man-working-on-a-laptop-in-a-library-34017-large.mp4', title: 'Documentary Film', category: 'Media', type: 'video' },
    { id: 8, imageUrl: 'https://picsum.photos/seed/p8/600/400', title: 'UI/UX Design', category: 'Tech', type: 'image' },
    { id: 9, imageUrl: 'https://picsum.photos/seed/p9/600/400', title: 'Content Strategy', category: 'Marketing', type: 'image' },
    { id: 10, imageUrl: 'https://picsum.photos/seed/p10/600/400', title: 'SEO Optimization', category: 'Marketing', type: 'image' },
    { id: 11, imageUrl: 'https://picsum.photos/seed/p11/600/400', title: 'Product Shoot', category: 'Media', type: 'image' },
    { id: 12, imageUrl: 'https://picsum.photos/seed/p12/600/400', title: 'Cloud Solutions', category: 'Tech', type: 'image' },
    { id: 13, imageUrl: 'https://picsum.photos/seed/p13/600/400', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-developer-codes-on-a-laptop-34912-large.mp4', title: 'SaaS Platform', category: 'Tech', type: 'video' },
    { id: 14, imageUrl: 'https://picsum.photos/seed/p14/600/400', title: 'Influencer Campaign', category: 'Marketing', type: 'image' },
    { id: 15, imageUrl: 'https://picsum.photos/seed/p15/600/400', title: 'Music Video', category: 'Media', type: 'image' },
    { id: 16, imageUrl: 'https://picsum.photos/seed/p16/600/400', title: 'IT Consulting', category: 'Tech', type: 'image' },
    { id: 17, imageUrl: 'https://picsum.photos/seed/p17/600/400', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-34909-large.mp4', title: 'Animated Ad', category: 'Media', type: 'video' },
    { id: 18, imageUrl: 'https://picsum.photos/seed/p18/600/400', title: 'PPC Campaign', category: 'Marketing', type: 'image' },
];

export const CLIENTS: Client[] = [
    { id: 1, logoUrl: 'https://picsum.photos/seed/c1/150/150', name: 'Client 1' },
    { id: 2, logoUrl: 'https://picsum.photos/seed/c2/150/150', name: 'Client 2' },
    { id: 3, logoUrl: 'https://picsum.photos/seed/c3/150/150', name: 'Client 3' },
    { id: 4, logoUrl: 'https://picsum.photos/seed/c4/150/150', name: 'Client 4' },
    { id: 5, logoUrl: 'https://picsum.photos/seed/c5/150/150', name: 'Client 5' },
    { id: 6, logoUrl: 'https://picsum.photos/seed/c6/150/150', name: 'Client 6' },
    { id: 7, logoUrl: 'https://picsum.photos/seed/c7/150/150', name: 'Client 7' },
    { id: 8, logoUrl: 'https://picsum.photos/seed/c8/150/150', name: 'Client 8' },
    { id: 9, logoUrl: 'https://picsum.photos/seed/c9/150/150', name: 'Client 9' },
    { id: 10, logoUrl: 'https://picsum.photos/seed/c10/150/150', name: 'Client 10' },
    { id: 11, logoUrl: 'https://picsum.photos/seed/c11/150/150', name: 'Client 11' },
    { id: 12, logoUrl: 'https://picsum.photos/seed/c12/150/150', name: 'Client 12' },
    { id: 13, logoUrl: 'https://picsum.photos/seed/c13/150/150', name: 'Client 13' },
    { id: 14, logoUrl: 'https://picsum.photos/seed/c14/150/150', name: 'Client 14' },
];


export const VISION_TEXT = "To be the first choice for companies and organizations in the region for digital marketing, media production, and integrated technology solutions.";
export const MISSION_TEXT = "To deliver real value to our clients through innovative, high-quality services that help grow their businesses and expand their digital presence.";

export const VALUES: Value[] = [
    { icon: 'fas fa-lightbulb', text: 'Innovation' },
    { icon: 'fas fa-handshake', text: 'Commitment' },
    { icon: 'fas fa-gem', text: 'Quality' },
    { icon: 'fas fa-eye', text: 'Transparency' },
    { icon: 'fas fa-users', text: 'Team Spirit' },
];