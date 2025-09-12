import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Main } from "../../components/main";
import { useData } from "../../components/context";
import { ConfigSiteType } from "../../components/types";
import { FooterSite, NavSite } from "../../components/navsite";

import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  ChevronRight,
} from "lucide-react";

import { Input } from "../../components/ui/input";
import { Separator } from "@radix-ui/react-select";

type imgType = {
  url: string;
  id_produto: string;
  ref: string;
};

type CoresETamanho = {
  tamanho: string | number;
  estoque: number;
  id_product_loja: number;
  cor: string;
};

export function DetalhesProduto() {
  const location = useLocation();
  const data = location.state.data;
  const img: imgType[] = location.state.img;
  const { isConfigSite } = useData() as {
    isConfigSite: ConfigSiteType;
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | number | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const realFormatado = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Get unique colors and sizes
  const uniqueColors: string[] = [
    ...new Set(
      (data.coresETamanhos as CoresETamanho[]).map((item) => item.cor)
    ),
  ];
  const uniqueSizes = [
    ...new Set(
      (data.coresETamanhos as CoresETamanho[]).map((item) => item.tamanho)
    ),
  ].sort((a, b) =>
    String(a).localeCompare(String(b), undefined, { numeric: true })
  );

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <>
      <Main style={{ backgroundColor: isConfigSite.body }}>
        <NavSite />

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Início</span>
            <ChevronRight className="h-4 w-4" />
            <span className="hover:text-blue-600 cursor-pointer">Calçados</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{data.produto}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0 relative group">
                  {img.length > 0 && (
                    <>
                      <img
                        src={img[selectedImage]?.url || img[0]?.url}
                        alt={data.produto}
                        className="w-full h-[500px] object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                        onClick={() =>
                          setZoomImg(img[selectedImage]?.url || img[0]?.url)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full shadow-sm"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isWishlisted
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-16 bg-white/80 hover:bg-white rounded-full shadow-sm"
                      >
                        <Share2 className="h-5 w-5 text-gray-600" />
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Thumbnail Gallery */}
              {img.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {img.map((image, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedImage === index
                          ? "ring-2 ring-blue-500 shadow-md"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <CardContent className="p-2">
                        <img
                          src={image.url}
                          alt={`${data.produto} ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Product Title and Rating */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {data.marca}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    Em Estoque
                  </Badge>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  {data.produto}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    (4.8) • 127 avaliações
                  </span>
                </div>
              </div>

              {/* Description */}
              {data.descricao && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Descrição
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {data.descricao}
                  </p>
                </div>
              )}

              {/* Price */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-500 line-through">
                    {realFormatado(data.preco * 1.3)}
                  </span>
                  <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
                    -23%
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {realFormatado(data.preco)}
                </div>
                <p className="text-sm text-gray-600">
                  ou 12x de {realFormatado(data.preco / 12)} sem juros
                </p>
              </div>

              {/* Color Selection */}
              {uniqueColors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Cor:{" "}
                    {selectedColor && (
                      <span className="font-normal text-gray-600">
                        {selectedColor}
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {uniqueColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${
                          selectedColor === color
                            ? "border-blue-500 scale-110 shadow-lg"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Tamanho:{" "}
                  {selectedSize && (
                    <span className="font-normal text-gray-600">
                      {selectedSize}
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-6 gap-3">
                  {uniqueSizes.map((size, index) => {
                    const sizeData = data.coresETamanhos.find(
                      (item: CoresETamanho) => item.tamanho === size
                    );
                    const isOutOfStock = sizeData?.estoque === 0;

                    return (
                      <button
                        key={index}
                        onClick={() => !isOutOfStock && setSelectedSize(size)}
                        disabled={isOutOfStock}
                        className={`h-12 border-2 rounded-lg font-medium transition-all duration-200 ${
                          selectedSize === size
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : isOutOfStock
                            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500 mt-2">Guia de tamanhos</p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Quantidade
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => handleQuantityChange("decrease")}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="h-12 w-20 text-center border-0 focus-visible:ring-0"
                        min="1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => handleQuantityChange("increase")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-gray-600">
                      {data.estoque} unidades disponíveis
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-semibold rounded-xl">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Adicionar ao Carrinho
                  </Button>
                  <Button variant="outline" className="h-14 px-6 rounded-xl">
                    Comprar Agora
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Truck className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Frete Grátis</p>
                    <p className="text-sm text-gray-600">Acima de R$ 199</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <RotateCcw className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Troca Grátis</p>
                    <p className="text-sm text-gray-600">7 dias para trocar</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Garantia</p>
                    <p className="text-sm text-gray-600">90 dias</p>
                  </div>
                </div>
              </div>

              {/* Stock Information */}
              <Card className="border-l-4 border-l-green-500 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">
                      ✓ Em estoque - Pronto para envio
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Envio em até 24h úteis para todo o Brasil
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Image Zoom Modal */}
        {zoomImg && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setZoomImg(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={zoomImg}
                alt="Product zoom"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              <Button
                onClick={() => setZoomImg(null)}
                variant="outline"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        <FooterSite style={{ backgroundColor: isConfigSite.footer }} />
      </Main>
    </>
  );
}
