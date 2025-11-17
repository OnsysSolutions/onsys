"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/_components/ui/dialog";
import { Button } from "@/_components/ui/button";
import { CopyButton } from "@/_components/copy-button";
import { InviteData } from "./page";

interface Props {
  open: boolean;
  onClose: (open: boolean) => void;
  inviteData: InviteData;
  setOpenLogin: (open: boolean) => void;
  setOpenSignup: (open: boolean) => void;
}

export default function InviteAuthDialog({ open, onClose, inviteData, setOpenLogin, setOpenSignup }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Autenticação necessária</DialogTitle>
          <DialogDescription>
            Faça login ou crie uma conta com o mesmo e-mail do convite:
            <span className="flex justify-center hover:opacity-95 items-center gap-2 p-2 mt-4 bg-gray-100 w-fit rounded-lg">
              <b>{inviteData?.email}</b>
              <CopyButton content={inviteData?.email} />
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-4">
          <Button
            onClick={() => {
              onClose(false);
              setOpenLogin(true);
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => {
              onClose(false);
              setOpenSignup(true);
            }}
          >
            Criar Conta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
