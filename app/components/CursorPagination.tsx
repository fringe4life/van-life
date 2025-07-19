import { DEFAULT_FILTER } from '~/constants/constants';
import CustomLink from './CustomLink';
import { buttonVariants } from './ui/button';

type PaginationProps = {
    limit: number;
    type: string | undefined;
    pathname: string;
};


export default function Pagination({
    type = DEFAULT_FILTER,
    limit,
    pathname,
}: PaginationProps) {
    
    
}
