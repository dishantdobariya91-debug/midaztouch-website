import './globals.css';

export const metadata = {
  title: 'Midaz Touch Wellness Center — Natural Healing with Fenugreek Therapy',
  description: "India's first AI-powered Fenugreek Therapy Platform. Restore blood flow, reduce pain, and heal naturally at Midaz Touch Wellness Center, Ahmedabad.",
  keywords: 'fenugreek therapy, natural healing, pain relief, ayurveda, ahmedabad, wellness center',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
