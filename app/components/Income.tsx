import { Card, CardContent } from "./ui/card";

type IncomeProps = {
  id: string;
  amount: number;
  rentedAt: Date;
};

export default function Income({ amount, rentedAt }: IncomeProps) {
  return (
    <Card>
      <CardContent>
        <p className="flex justify-between">
          <span>{amount} </span>
          <span>{rentedAt.toLocaleString() || "unknown"}</span>
        </p>
      </CardContent>
    </Card>
  );
}
