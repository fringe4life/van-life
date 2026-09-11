function withSearch(pathname: string, search: string): string {
  if (search.length === 0) {
    return pathname;
  }

  return `${pathname}${search}`;
}

export { withSearch };
