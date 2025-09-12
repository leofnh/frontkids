"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

interface iCard {
  title: string;
  description: string;
  data: Array<string>;
}

export const CardVendas: React.FC<iCard> = ({ title, description, data }) => {
  const chartConfig = {
    percentual: {
      label: "Percentual",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  return (
    <>
      <Card className="h-[100%]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="forma"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip />
              <Bar
                dataKey="percentual"
                fill="var(--color-desktop)"
                radius={8}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Percentuais das formas de pagamento{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </>
  );
};
