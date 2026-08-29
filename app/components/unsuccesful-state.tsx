export interface UnsuccesfulStateProps {
  isError?: boolean;
  message: string;
}

const UnsuccesfulState = ({ message, isError }: UnsuccesfulStateProps) => (
  <div
    className="grid h-full w-full items-center error:text-destructive"
    data-error={isError}
    data-unsuccessful
  >
    <p className="text-center">{message}</p>
  </div>
);

export { UnsuccesfulState };
