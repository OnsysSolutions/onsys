"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/_components/ui/button";
import { CardFooter } from "./ui/card";

interface Props {
  handleAccept: () => void;
  handleDecline: () => void;
  isAccepting: boolean;
  isDeclining: boolean;
}

export default function InviteActions({
  handleAccept,
  handleDecline,
  isAccepting,
  isDeclining,
}: Props) {
  return (
    <CardFooter className="flex flex-col gap-3">
      <Button
        className="w-full font-semibold"
        onClick={handleAccept}
        disabled={isAccepting || isDeclining}
      >
        {isAccepting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Aceitando...
          </>
        ) : (
          "Aceitar Convite"
        )}
      </Button>
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={handleDecline}
        disabled={isAccepting || isDeclining}
      >
        {isDeclining ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Recusando...
          </>
        ) : (
          "Recusar"
        )}
      </Button>
    </CardFooter>
  );
}
