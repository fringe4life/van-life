export type FetcherState = "idle" | "submitting" | "loading";

export interface FetcherStateObject {
  fetcherState: FetcherState;
}
