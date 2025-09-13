"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";

import { ChartConfig, ChartContainer } from "../../components/ui/chart";

import {
  TrendingUp,
  BarChart3,
  CreditCard,
  Banknote,
  Wallet,
  Target,
  Activity,
  Award,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

interface PaymentData {
  forma: string;
  percentual: number;
}

interface iCard {
  title: string;
  description: string;
  data: PaymentData[];
}

export const CardVendas: React.FC<iCard> = ({ title, description, data }) => {
  const chartConfig = {
    percentual: {
      label: "Percentual",
      color: "#ed8c3b",
    },
  } satisfies ChartConfig;

  // Função para obter o ícone baseado na forma de pagamento
  const getPaymentIcon = (forma: string) => {
    const formaLower = forma.toLowerCase();
    if (formaLower.includes("cartão") || formaLower.includes("cartao")) {
      return CreditCard;
    } else if (
      formaLower.includes("dinheiro") ||
      formaLower.includes("especie")
    ) {
      return Banknote;
    } else if (formaLower.includes("pix")) {
      return Wallet;
    } else {
      return Activity;
    }
  };

  // Calcular estatísticas
  const maiorPercentual = Math.max(
    ...data.map((item: PaymentData) => item.percentual || 0)
  );
  const formaDominante = data.find(
    (item: PaymentData) => item.percentual === maiorPercentual
  );

  return (
    <>
      <Card className="h-full border-brand-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50 to-brown-50 border-b border-brand-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-brown-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {title}
                </CardTitle>
                <CardDescription className="text-brown-600 mt-1">
                  {description}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-brand-600" />
                <span className="text-xs text-brown-600 bg-brand-100 px-2 py-1 rounded-full">
                  {data.length} forma{data.length !== 1 ? "s" : ""} de pagamento
                </span>
              </div>
              {formaDominante && (
                <div className="flex items-center gap-1 text-xs text-brown-600">
                  <Target className="h-3 w-3" />
                  <span>
                    Líder: {formaDominante.forma} ({formaDominante.percentual}%)
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6">
          {data.length > 0 ? (
            <>
              {/* Resumo rápido */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {data.slice(0, 3).map((item, index) => {
                  const IconComponent = getPaymentIcon(item.forma);
                  return (
                    <div
                      key={index}
                      className="bg-brand-50/50 rounded-lg p-3 border border-brand-100"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="h-4 w-4 text-brand-600" />
                        <span className="text-xs font-medium text-brown-700 truncate">
                          {item.forma}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-brand-700">
                        {item.percentual}%
                      </div>
                      <div className="w-full bg-brand-100 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentual}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gráfico principal */}
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="forma"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#8B5A2B" }}
                    tickFormatter={(value) =>
                      value.length > 10 ? `${value.substring(0, 10)}...` : value
                    }
                  />
                  <YAxis
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 12, fill: "#8B5A2B" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-brand-200 rounded-lg shadow-lg">
                            <p className="font-medium text-brown-800">
                              {label}
                            </p>
                            <p className="text-brand-600 flex items-center gap-1">
                              <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
                              {payload[0].value}% das vendas
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="percentual"
                    fill="#ed8c3b"
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ChartContainer>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-brown-500">
              <BarChart3 className="h-16 w-16 text-brown-300 mb-4" />
              <p className="text-lg font-medium">Nenhum dado disponível</p>
              <p className="text-sm text-brown-400">
                Aguardando dados de vendas...
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-brand-50/50 to-brown-50/50 border-t border-brand-200 p-4">
          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-medium text-brown-700">
                <Activity className="h-4 w-4 text-brand-500" />
                Análise de Pagamentos
              </div>
              <div className="text-xs text-brown-600 bg-white px-2 py-1 rounded-full border border-brand-100">
                Atualizado agora
              </div>
            </div>

            {formaDominante && data.length > 0 && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brand-500 rounded-full"></div>
                  <span className="text-brown-600">
                    <strong className="text-brand-700">
                      {formaDominante.forma}
                    </strong>{" "}
                    lidera com{" "}
                    <strong className="text-brand-700">
                      {formaDominante.percentual}%
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-brown-600">
                    <strong className="text-brown-700">{data.length}</strong>{" "}
                    formas ativas
                  </span>
                </div>
              </div>
            )}

            {(!formaDominante || data.length === 0) && (
              <div className="text-sm text-brown-500 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Aguardando dados para análise detalhada
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </>
  );
};
