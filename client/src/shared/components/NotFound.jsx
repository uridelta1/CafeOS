import React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "./Primitives.jsx";
export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="404 · WRONG TURN"
        title="This page isn't on the menu."
        description="The page may have moved, or the URL may be incorrect."
      />
      <Link className="button primary" to="/">
        Back to dashboard
      </Link>
    </>
  );
}
