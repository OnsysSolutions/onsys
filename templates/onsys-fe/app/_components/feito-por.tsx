import Link from "next/link";
import { linkMadeBy, madeBy } from "@/_lib/const";

export default function FeitoPor() {
  const nowYear = new Date().getFullYear();

  return (
    <span>
      Feito por{" "}
      <Link className="text-primary hover:underline" href={linkMadeBy}>
        {madeBy}
      </Link>{" "}
      © {nowYear}
    </span>
  );
}
