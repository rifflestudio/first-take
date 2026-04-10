"use client";

import Link from "next/link";
import LogoSmall from "../components/logo-small/Logo.small";
import CustomCursor from "../components/CustomCursor";

export default function PrivacyPolicy() {
  return (
    <div
      className="min-h-screen flex flex-col relative bg-surface text-primary"
      style={{
        fontFamily: "var(--font-triplex-1mm)",
        letterSpacing: "normal",
      }}
    >
      <CustomCursor />
      {/* Header */}
      <header className="relative z-30 bg-surface-soft backdrop-blur-lg">
        <div className="mx-auto flex max-w-[1164px] items-center justify-between px-6 py-6 md:px-[138px]">
          <Link href="/" className="flex items-center">
            <LogoSmall className="h-8 w-auto" />
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold">
              Privacy Policy
            </h1>
            <p className="text-secondary text-sm">
              Last updated: November 29, 2025
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 text-[15px] leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p className="text-secondary">
                Riffle, Inc. (&quot;Riffle,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your
                privacy and is committed to protecting your personal data. This
                privacy policy explains how we collect, use, disclose, and
                safeguard your information when you use our music creation
                platform and related services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                2. Information We Collect
              </h2>
              <p className="text-secondary">
                We may collect the following types of information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-secondary ml-4">
                <li>
                  <strong>Account Information:</strong> Name, email address, and
                  profile details when you create an account.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you
                  interact with our platform, including features used and time
                  spent.
                </li>
                <li>
                  <strong>Content:</strong> Audio recordings, musical projects,
                  lyrics, and other creative content you upload or create.
                </li>
                <li>
                  <strong>Device Information:</strong> Browser type, operating
                  system, and device identifiers.
                </li>
                <li>
                  <strong>Communication Data:</strong> Messages you send to us
                  or other users through our platform.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                3. How We Use Your Information
              </h2>
              <p className="text-secondary">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-secondary ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your transactions and manage your account</li>
                <li>Enable collaboration features between users</li>
                <li>
                  Send you updates, security alerts, and support messages
                </li>
                <li>Personalize your experience on our platform</li>
                <li>
                  Analyze usage patterns to enhance our product offerings
                </li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">4. Data Sharing</h2>
              <p className="text-secondary">
                We do not sell your personal information. We may share your
                information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-secondary ml-4">
                <li>
                  <strong>With Your Consent:</strong> When you explicitly agree
                  to share content with collaborators or make it public.
                </li>
                <li>
                  <strong>Service Providers:</strong> With third-party vendors
                  who assist us in operating our platform (e.g., cloud hosting,
                  analytics).
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights and safety.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">5. Data Security</h2>
              <p className="text-secondary">
                We implement appropriate technical and organizational measures
                to protect your personal data against unauthorized access,
                alteration, disclosure, or destruction. This includes
                encryption, secure servers, and regular security assessments.
                However, no method of transmission over the Internet is 100%
                secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">6. Your Rights</h2>
              <p className="text-secondary">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-secondary ml-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="text-secondary">
                To exercise these rights, please contact us at{" "}
                <a
                  href="mailto:hi@riffle.studio"
                  className="underline underline-offset-2 hover:text-primary transition-colors"
                >
                  hi@riffle.studio
                </a>
                .
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                7. Cookies and Tracking Technologies
              </h2>
              <p className="text-secondary">
                We use cookies and similar tracking technologies to enhance your
                experience, analyze usage, and deliver personalized content. You
                can manage your cookie preferences through your browser
                settings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">8. Data Retention</h2>
              <p className="text-secondary">
                We retain your personal data for as long as necessary to fulfill
                the purposes outlined in this policy, unless a longer retention
                period is required by law. When you delete your account, we will
                delete or anonymize your personal data within a reasonable
                timeframe.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">9. Children&apos;s Privacy</h2>
              <p className="text-secondary">
                Our services are not intended for children under 13 years of
                age. We do not knowingly collect personal information from
                children under 13. If you believe we have collected such
                information, please contact us immediately.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">10. International Transfers</h2>
              <p className="text-secondary">
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place to protect your data in accordance with this
                privacy policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                11. Changes to This Policy
              </h2>
              <p className="text-secondary">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the &quot;Last updated&quot; date. We encourage you to review
                this policy periodically.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">12. Contact Us</h2>
              <p className="text-secondary">
                If you have any questions about this privacy policy or our data
                practices, please contact us at:
              </p>
              <div className="text-secondary">
                <p>Riffle, Inc.</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:hi@riffle.studio"
                    className="underline underline-offset-2 hover:text-primary transition-colors"
                  >
                    hi@riffle.studio
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Link back home */}
          <div className="pt-8 border-t border-soft">
            <Link
              href="/"
              className="text-sm text-secondary hover:text-primary underline underline-offset-4 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

