"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRight } from "lucide-react";

import MagneticBorderBottom from "@/components/utility/MagneticBorderBottom";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    label: "Features",
    href: "#features",
    dropdownItems: [
      {
        title: "Modern product teams",
        href: "/#feature-modern-teams",
        description:
          "Mainline is built on the habits that make the best product teams successful",
      },
      {
        title: "Resource Allocation",
        description: "Mainline your resource allocation and execution",
      },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <section
      className={cn(
        "",
      )}
    >
      <div className="flex items-center justify-end">

        {/* Desktop Navigation */}

        {/* Auth Buttons */}
        <div className="flex items-center gap-2.5">

          {/* Navigation */}
          <nav className="flex justify-end gap-6 text-sm">
            <Link href="#projectWork" data-no-blobity
            >
              <MagneticBorderBottom
                borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                borderHeight={2}
                magneticStrength={0.3}
                transitionDuration={300}
                className="text-[#19adfd] dark:text-yellow-300"
              >
                Project Work</MagneticBorderBottom>
            </Link>
            <Link href="mailto:devangkantharia@gmail.com?subject=Let us work together." data-no-blobity
            >
              <MagneticBorderBottom
                borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                borderHeight={2}
                magneticStrength={0.3}
                transitionDuration={300}
                className="text-[#19adfd] dark:text-yellow-300"
              >
                Say Hi...</MagneticBorderBottom>
            </Link>
          </nav>
        </div>
      </div>

      {/*  Mobile Menu Navigation */}
      <div
        className={cn(
          "bg-background fixed inset-x-0 top-[calc(100%+1rem)] flex flex-col rounded-2xl border p-6 transition-all duration-300 ease-in-out lg:hidden",
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0",
        )}
      >
        <nav className="divide-border flex flex-1 flex-col divide-y">
          {ITEMS.map((link) =>
            link.dropdownItems ? (
              <div key={link.label} className="py-4 first:pt-0 last:pb-0">
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === link.label ? null : link.label,
                    )
                  }
                  className="text-primary flex w-full items-center justify-between text-base font-medium"
                >
                  {link.label}
                  <ChevronRight
                    className={cn(
                      "size-4 transition-transform duration-200",
                      openDropdown === link.label ? "rotate-90" : "",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openDropdown === link.label
                      ? "mt-4 max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0",
                  )}
                >
                  <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                    {link.dropdownItems.map((item) =>
                      item.href ? (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="group hover:bg-accent block rounded-md p-2 transition-colors"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setOpenDropdown(null);
                          }}
                        >
                          <div className="transition-transform duration-200 group-hover:translate-x-1">
                            <div className="text-primary font-medium">
                              {item.title}
                            </div>

                            <p className="text-muted-foreground mt-1 text-sm">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ) : null,
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-primary hover:text-primary/80 py-4 text-base font-medium transition-colors first:pt-0 last:pb-0",
                  pathname === link.href && "text-muted-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </section>
  );
};
