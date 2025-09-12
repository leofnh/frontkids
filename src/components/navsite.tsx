import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useData } from "./context";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import {
  CreditCardIcon,
  Home,
  Instagram,
  LockKeyhole,
  LogIn,
  LogOut,
  Menu,
  PhoneCall,
  Repeat2,
  Search,
  ShoppingBag,
  Store,
  TruckIcon,
  User,
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ImgSlide, TypeCarrinho } from "./types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";

interface Props {
  searchTerm?: Dispatch<SetStateAction<string>>;
  style?: React.CSSProperties;
}

interface PropsFooter {
  style?: React.CSSProperties;
}

type ConfigSiteType = {
  body: string;
  header: string;
  footer: string;
};

export const NavSite: React.FC<Props> = ({ searchTerm, style }) => {
  const { isAuthenticated, lojaCarrinho, logout, isImgSlide } = useData() as {
    isAuthenticated: boolean;
    isConfigSite: ConfigSiteType;
    isImgSlide: ImgSlide[];
    lojaCarrinho: TypeCarrinho[];
    logout: () => void;
  };
  const logoLoja = "https://i.imgur.com/ybvN8FD.jpeg";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const imgSlide = useMemo(
    () => [
      "https://i.imgur.com/ePrwFPI.jpeg",
      "https://i.imgur.com/IWQ1JXM.jpeg",
      "https://i.imgur.com/ScrceA6.jpeg",
    ],
    []
  );

  const renderSlides =
    isImgSlide.length > 0 ? isImgSlide : imgSlide.map((url) => ({ url }));

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % renderSlides.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [renderSlides.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? renderSlides.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  }, [renderSlides.length, isTransitioning]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [currentIndex, isTransitioning]
  );

  // Auto-play functionality
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isDragging]);

  // Touch/Mouse handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    setDragOffset(0);
  };

  const navLinks = (
    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 text-gray-700">
      <Link
        to="/loja/"
        className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium"
      >
        <Home className="size-4" />
        <span>Início</span>
      </Link>
      <Link
        to="/loja/sobrenos/"
        className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium"
      >
        <Store className="size-4" />
        <span>Sobre Nós</span>
      </Link>
      <Link
        to="/caixa/"
        className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium"
      >
        <Store className="size-4" />
        <span>Sobre Nós</span>
      </Link>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg"
            >
              <User className="size-4" />
              <span className="lg:hidden">Minha Conta</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-lg shadow-lg border-0 bg-white">
            <DropdownMenuLabel className="font-semibold text-gray-900">
              Minha Conta
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-gray-50 rounded-md">
                <User className="mr-2 h-4 w-4" />
                <span>Meus Dados</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50 rounded-md">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <Link to="/loja/meus/pedidos/">
                  <span>Meus Pedidos</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="hover:bg-red-50 text-red-600 rounded-md"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          to="/login/"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <LogIn className="size-4" />
          <span>Entrar</span>
        </Link>
      )}
      <Link
        to="/loja/carrinho/"
        className="relative flex items-center gap-2 hover:text-blue-600 transition-colors font-medium"
      >
        <ShoppingBag className="size-5" />
        {lojaCarrinho?.length > 0 && (
          <Badge className="absolute -top-2 -right-3 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs p-0 rounded-full">
            {lojaCarrinho.length}
          </Badge>
        )}
        <span className="lg:hidden">Carrinho</span>
      </Link>
    </div>
  );

  return (
    <>
      <header
        className="sticky top-0 z-30 w-full bg-white/95 shadow-sm backdrop-blur-md border-b border-gray-100"
        style={style}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link to="/loja/" className="flex items-center gap-3">
            <img
              src={logoLoja}
              alt="Logo"
              className="h-12 w-12 rounded-full shadow-sm"
            />
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-gray-900">
                Paula Calçados
              </span>
              <p className="text-xs text-gray-500">Qualidade e estilo</p>
            </div>
          </Link>

          {searchTerm && (
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Input
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  placeholder="O que você procura?"
                  onChange={(e) => searchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
          )}

          <div className="hidden lg:flex items-center">{navLinks}</div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-lg">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left text-xl font-bold">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4">{navLinks}</nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {/* Modern Hero Carousel */}
        <div className="relative w-full h-[400px] sm:h-[600px] overflow-hidden bg-gray-900">
          {/* Main carousel container */}
          <div
            className="relative h-full cursor-grab active:cursor-grabbing select-none"
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            {/* Slides wrapper */}
            <div
              className="flex h-full transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(-${currentIndex * 100}% + ${
                  isDragging ? dragOffset : 0
                }px))`,
                transitionDuration: isDragging ? "0ms" : "500ms",
              }}
            >
              {renderSlides.map((src, index) => (
                <div
                  key={`carousel-slide-${index}`}
                  className="relative w-full h-full flex-shrink-0"
                >
                  {/* Blurred background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
                    style={{ backgroundImage: `url(${src.url})` }}
                  />

                  {/* Dark overlay for better contrast */}
                  <div className="absolute inset-0 bg-black/40" />

                  {/* Main image centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={src.url}
                      alt={`Slide ${index + 1}`}
                      className="max-w-full max-h-full object-contain relative z-10"
                      draggable={false}
                    />
                  </div>

                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-20" />

                  {/* Content overlay */}
                  <div className="absolute bottom-16 left-8 right-8 text-white z-30">
                    <div className="max-w-2xl">
                      <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl">
                        Paula Calçados
                      </h2>
                      <p className="text-lg md:text-xl mb-6 drop-shadow-xl opacity-95">
                        Qualidade e estilo em cada passo
                      </p>
                      <Button
                        className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105"
                        asChild
                      >
                        <Link to="/loja/">Ver Produtos</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <Button
              onClick={prevSlide}
              disabled={isTransitioning}
              variant="ghost"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white disabled:opacity-50 transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>

            <Button
              onClick={nextSlide}
              disabled={isTransitioning}
              variant="ghost"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white disabled:opacity-50 transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>

          {/* Modern indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
            {renderSlides.map((_, index) => (
              <button
                key={`indicator-${index}`}
                onClick={() => goToSlide(index)}
                className="relative group"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
                {currentIndex === index && (
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
            <div
              className="h-full bg-white transition-all duration-500 ease-out"
              style={{
                width: `${((currentIndex + 1) / renderSlides.length) * 100}%`,
              }}
            />
          </div>

          {/* Slide counter */}
          <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {renderSlides.length}
          </div>
        </div>

        {/* Mobile Search */}
        {searchTerm && (
          <div className="container mx-auto px-4 md:px-6 py-4 md:hidden">
            <div className="relative">
              <Input
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 transition-colors"
                placeholder="O que você procura?"
                onChange={(e) => searchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export const FooterSite: React.FC<PropsFooter> = ({ style }) => {
  const getYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300" style={style}>
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-xl">
            <TruckIcon className="h-12 w-12 mb-4 text-blue-400" />
            <span className="font-bold text-lg text-white mb-2">
              RECEBA EM CASA
            </span>
            <span className="text-sm">Entregamos para todo o Brasil</span>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-xl">
            <Repeat2 className="h-12 w-12 mb-4 text-green-400" />
            <span className="font-bold text-lg text-white mb-2">
              TROCA E DEVOLUÇÃO
            </span>
            <span className="text-sm">7 dias após o recebimento</span>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-xl">
            <CreditCardIcon className="h-12 w-12 mb-4 text-yellow-400" />
            <span className="font-bold text-lg text-white mb-2">
              PARCELE EM ATÉ
            </span>
            <span className="text-sm">12x com cartão de crédito</span>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-xl">
            <LockKeyhole className="h-12 w-12 mb-4 text-red-400" />
            <span className="font-bold text-lg text-white mb-2">
              SITE 100% SEGURO
            </span>
            <span className="text-sm">Seus dados estão protegidos</span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-gray-700 pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Institucional</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/loja/"
                  className="hover:text-blue-400 transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/loja/sobrenos"
                  className="hover:text-blue-400 transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Minha Conta</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="hover:text-blue-400 transition-colors"
                >
                  Entrar
                </Link>
              </li>
              <li>
                <Link
                  to="/loja/meus/pedidos"
                  className="hover:text-blue-400 transition-colors"
                >
                  Meus Pedidos
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Fale Conosco</h3>
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4" />
              <span>(31) 99734-6732</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">
              Formas de Pagamento
            </h3>
            <div className="flex items-center gap-3">
              <img
                className="h-8 rounded"
                src="https://i.imgur.com/04CvMF7.png"
                alt="Visa"
              />
              <img
                className="h-8 rounded"
                src="https://i.imgur.com/0wtTRVv.png"
                alt="Mastercard"
              />
              <img
                className="h-8 rounded"
                src="https://i.imgur.com/2G4ToPu.png"
                alt="Pix"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Redes Sociais</h3>
            <a
              href="https://www.instagram.com/paula_calcados_store/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-pink-400 transition-colors"
            >
              <Instagram className="text-pink-500" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="container mx-auto text-center text-sm">
          <p className="text-gray-400">
            Paula Calçados e Store &copy; {getYear} Todos Direitos Reservados
          </p>
          <p className="text-gray-500">CNPJ: 30.393.198/0001-81</p>
        </div>
      </div>
    </footer>
  );
};
