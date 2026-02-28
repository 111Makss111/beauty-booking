import Header from "@/components/user/header";
import Hero from "@/components/user/hero";
import Products from "@/components/user/products";
import Benefits from "@/components/user/benefits";
import Footer from "@/components/user/footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <Products />
      <Benefits />
      <Footer />
    </main>
  );
}
