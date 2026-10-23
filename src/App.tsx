import About from "./components/About";
import BookingPolicy from "./components/BookingPolicy";
import Breadcrumbs from "./components/Breadcrumbs";
import Contact from "./components/Contact";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import GiftVouchers from "./components/GiftVouchers";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Location from "./components/Location";
import Marquee from "./components/Marquee";
import Reviews from "./components/Reviews";
import Seo from "./components/Seo";
import Terms from "./components/Terms";
import Treatments from "./components/Treatments";

export default function App() {
  return (
    <div className="relative min-h-screen bg-cream">
      <Seo />
      {/* film grain texture over everything */}
      <div className="grain" aria-hidden="true" />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-forest focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ivory"
      >
        Skip to main content
      </a>

      <Header />
      <Breadcrumbs />

      <main id="main-content">
        <Hero />
        <Marquee />
        <About />
        <Treatments />
        <GiftVouchers />
        <BookingPolicy />
        <Terms />
        <Reviews />
        <Faq />
        <Location />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
