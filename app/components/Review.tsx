import { Link, href } from "react-router";
import { Badge } from "./ui/badge";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "./ui/card";

type ReviewProps = {
  name: string;
  rating: number;
  text: string;
  timestamp: string;
  id: string;
};

export default function Review({ name, rating, text, timestamp }: ReviewProps) {
  return (
    <Card>
      <CardHeader>
        <p>{rating}</p>
        <CardTitle>
          {name} <span>{timestamp ?? "unknown"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>{text}</CardContent>
    </Card>
  );
}
