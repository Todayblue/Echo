import { BLOG_ITEM_PER_PAGE } from "../lib/constants";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "./ui/button";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  url: string;
  isPreviousData: boolean;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

const BlogPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  url,
  isLoading,
  isPreviousData,
  onPageChange,
}) => {
  const router = useRouter();

  const handleNextPageClick = () => {
    onPageChange(currentPage + 1);
    router.push(`${url}${currentPage + 1}&limit=${BLOG_ITEM_PER_PAGE}`);
  };

  const pageCount = Math.ceil(totalItems / BLOG_ITEM_PER_PAGE);

  const handlePreviousPageClick = () => {
    onPageChange(currentPage - 1);
    router.push(`${url}${currentPage - 1}&limit=${BLOG_ITEM_PER_PAGE}`);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant={"outline"}
            disabled={currentPage === 1 || isPreviousData}
          >
            <PaginationPrevious onClick={handlePreviousPageClick} />
          </Button>
        </PaginationItem>
        {[...Array(pageCount)].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              isActive={index + 1 === currentPage}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            variant={"outline"}
            disabled={currentPage === pageCount || isPreviousData}
          >
            <PaginationNext onClick={handleNextPageClick} />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default BlogPagination;
