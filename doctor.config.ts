import type { ReactDoctorConfig } from "react-doctor/api";

export default {
  deadCode: false,
  ignore: {
    files: ["build", "app/generated/**"],
    overrides: [
      {
        files: ["app/root.tsx", "app/components/ui/**"],
        rules: ["react-doctor/no-multi-comp"],
      },
      {
        files: ["app/features/host/components/review/rating-stars.tsx"],
        rules: ["react-doctor/no-array-index-as-key"],
      },
      {
        files: ["app/components/ui/**"],
        rules: ["react-doctor/label-has-associated-control"],
      },
    ],
    rules: [
      "react-doctor/only-export-components",
      "react-doctor/server-auth-actions",
    ],
  },
  rules: {
    "react-doctor/design-no-vague-button-label": "warn",
    "react-doctor/jsx-no-useless-fragment": "warn",
    "react-doctor/no-danger": "warn",
  },
  scope: "full",
  share: false,
  verbose: true,
} satisfies ReactDoctorConfig;
