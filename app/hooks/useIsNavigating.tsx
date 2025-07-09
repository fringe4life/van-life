import { useNavigation } from "react-router";

export default function useIsNavigating() {
  const navigation = useNavigation();
  return {
    changingPage: Boolean(navigation.location),
    usingForm: navigation.formAction !== undefined,
  };
}
