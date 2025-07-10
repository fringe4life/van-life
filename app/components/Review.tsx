import { Link, href } from "react-router";
import { Badge } from "./ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import RatingStars from "./RatingStars";

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
        <RatingStars rating={rating} />
        <CardTitle className="my-4">
          {name}{" "}
          <span className="text-text-secondary">{timestamp ?? "unknown"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>{text}</CardContent>
    </Card>
  );
}
