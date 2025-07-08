type RatingStarsProps = {
  rating: number;
};
import { StarIcon } from "lucide-react";
export default function RatingStars({ rating }: RatingStarsProps) {
  let stars = [];
  for (let i = 1; i < 6; i++) {
    i <= rating
      ? stars.push(<StarIcon key={i} className="fill-orange-400 " />)
      : stars.push(<StarIcon key={i} />);
  }
  return <p className="flex gap-2">{stars}</p>;
}
