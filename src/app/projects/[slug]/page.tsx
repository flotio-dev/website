"use client";

import ProjectPage from '../project-detail/page';

export default function SlugProjectPage() {
  // The imported ProjectPage reads window.location.pathname to determine the slug.
  return <ProjectPage />;
}
