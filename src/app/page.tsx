import Link from "next/link";
import Image from "next/image";
import { BaseButton } from "@/presentation/design/components/buttons";
import { Navbar } from "@/presentation/components/organisms/Navbar";
import { Footer } from "@/presentation/components/organisms/Footer";
import { ArrowRight, Printer, Users, MapPin, Star, Zap, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-background-main">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-light via-white to-brand-light/50 pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Zap className="w-4 h-4" />
                  Lançamento MVP 2025
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-text-primary leading-tight mb-6">
                  Onde ideias
                  <br />
                  <span className="text-brand-primary">ganham forma</span>
                </h1>

                <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                  O ecossistema completo de impressão 3D. Conecte-se com makers
                  certificados, compre arquivos STL ou encontre quem fabrique suas
                  peças sob demanda.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/marketplace">
                    <BaseButton size="lg" className="w-full sm:w-auto">
                      Explorar Marketplace
                      <ArrowRight className="w-5 h-5" />
                    </BaseButton>
                  </Link>

                  <Link href="/makers">
                    <BaseButton variant="outline" size="lg" className="w-full sm:w-auto">
                      Encontrar Makers
                    </BaseButton>
                  </Link>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-8 mt-12">
                  <div>
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-text-muted">
                      <span className="font-semibold text-text-primary">4.9/5</span> de
                      avaliação
                    </p>
                  </div>

                  <div className="h-12 w-px bg-gray-300" />

                  <div>
                    <p className="text-2xl font-bold text-text-primary">150+</p>
                    <p className="text-sm text-text-muted">Makers ativos</p>
                  </div>
                </div>
              </div>

              {/* Right Content - Image/Illustration */}
              <div className="relative">
                <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://placehold.co/600x500/6C6CF2/white?text=3D+Printer"
                    alt="Impressora 3D"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Floating Cards */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">
                  <p className="text-sm text-text-muted">Entrega rápida</p>
                  <p className="text-2xl font-bold text-brand-primary">2-5 dias</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-text-primary mb-4">
                Tudo que você precisa em um só lugar
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Da ideia ao produto final, conectamos você com a melhor tecnologia
                maker do Brasil
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-glow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Printer className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Marketplace Completo</h3>
                <p className="text-text-secondary leading-relaxed">
                  Produtos físicos, arquivos STL e insumos para impressão 3D. Tudo
                  verificado e com garantia de qualidade.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-glow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Makers Certificados</h3>
                <p className="text-text-secondary leading-relaxed">
                  Conecte-se com profissionais verificados, avaliados pela comunidade
                  e prontos para fabricar suas ideias.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-glow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Makers Próximos</h3>
                <p className="text-text-secondary leading-relaxed">
                  Encontre fabricantes na sua região através do nosso mapa interativo.
                  Entrega rápida e suporte local.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl p-12 lg:p-16 text-center text-white shadow-glow-lg relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                  Pronto para transformar sua ideia em realidade?
                </h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Junte-se à maior comunidade maker do Brasil. Cadastro gratuito e sem
                  compromisso.
                </p>
                <Link href="/auth/signup">
                  <BaseButton
                    size="lg"
                    className="bg-white text-brand-primary hover:bg-gray-100 shadow-xl"
                  >
                    Criar Conta Grátis
                    <ArrowRight className="w-5 h-5" />
                  </BaseButton>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
