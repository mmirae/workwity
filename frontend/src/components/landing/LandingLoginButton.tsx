"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RoleLoginModal } from "@/components/layout/RoleLoginModal";

/**
 * Isolated client island so the rest of the landing page can stay a server
 * component — only the login trigger needs interactivity.
 */
export function LandingLoginButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" size="lg" onClick={() => setOpen(true)}>
        로그인
      </Button>
      <RoleLoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
