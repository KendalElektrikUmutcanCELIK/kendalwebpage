'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { isGithubPagesBuild } from '@/lib/basePath';

type BrandHomeLinkProps = ComponentProps<'a'> & { href: string };

// getBrandHomeHref() returns an absolute in-app route on GH Pages ("/brand/k2")
// but a bare "/" in production (relying on the k2./vanti./global. subdomain's
// server-side rewrite to "/brand/k2"). A bare "/" is also a real route in this
// app's own tree (the main site's homepage), so Next's <Link> would resolve it
// client-side to the WRONG page instead of ever reaching the server rewrite.
// Forcing a real navigation via a plain <a> sidesteps that — the server-side
// rewrite (which IS correct, see public/web.config) handles it from there.
export const BrandHomeLink = (props: BrandHomeLinkProps) =>
  isGithubPagesBuild ? <Link {...props} /> : <a {...props} />;
