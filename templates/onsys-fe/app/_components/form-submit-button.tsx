"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/_components/ui/button";

export function FormSubmitButton({
  children,
  form,
}: {
  children: React.ReactNode;
  form?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className=" relative transition-all disabled:opacity-70"
      form={form}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enviando...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
