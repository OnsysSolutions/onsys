import { Spinner } from "./_components/spinner";

export default function Loading() {
  return (
    <Spinner
      size={64}
      className="absolute top-1/2 left-1/2 -translate-1/2"
      variant="ring"
    />
  );
}
