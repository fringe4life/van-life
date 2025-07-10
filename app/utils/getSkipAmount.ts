


export default function getSkipAmount(page: number, limit: number) {
    return page === 1 ? 0 : (page - 1) * limit;
}