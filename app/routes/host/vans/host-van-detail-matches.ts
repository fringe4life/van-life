import type { Route } from "./+types/index";

const HOST_VAN_DETAIL_ROUTE_ID = "routes/host/vans/index";

type HostVanDetailLoaderData = Route.ComponentProps["loaderData"];

function getHostVanDetailLoaderData(
  matches: ReadonlyArray<{ id: string; loaderData?: unknown } | undefined>
) {
  const match = matches.find(
    (candidate) => candidate?.id === HOST_VAN_DETAIL_ROUTE_ID
  );

  if (!match?.loaderData) {
    throw new Error("Host van detail loader data is missing");
  }

  return match.loaderData as HostVanDetailLoaderData;
}

export { getHostVanDetailLoaderData };
