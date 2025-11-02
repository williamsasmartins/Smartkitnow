import React from "react";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import ShareBox from "@/components/share/ShareBox";
import SuggestBoxInline from "@/components/contact/SuggestBoxInline";

export default function LoanPaymentCalculatorPrincipalRateTerm() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:grid lg:grid-cols-12 lg:gap-8">
      {/* LEFT: editorial content */}
      <article className="lg:col-span-7 prose prose-neutral dark:prose-invert">
        <h1 className="mb-2">Loan Payment Calculator (Principal, Rate, Term)</h1>
        <p className="text-sm opacity-80">Category: financial · Subcategory: loans-mortgages-payments</p>

        <div className="mt-8">
          <h3>Formula</h3>
          <pre><code>// TODO: document the formula used here.</code></pre>
        </div>

        <div className="mt-8">
          <h3>Examples</h3>
          <ul>
            <li>Example A — replace with a real example.</li>
            <li>Example B — replace with a real example.</li>
          </ul>
        </div>

        <div className="mt-8">
          <h3>References</h3>
          <ul>
            <li>Add authoritative sources here.</li>
          </ul>
        </div>

        {/* Always keep this block here (final of the left column) */}
        <LegalDisclaimer
          kind="financial"
          locale="en"
          note="Smart Kit Now is not responsible for actions taken based on these estimates."
          className="mt-10"
        />

        {/* Then your existing boxes */}
        <ShareBox className="mt-6" />
        <div className="mt-4">
          <SuggestBoxInline />
        </div>
      </article>

      {/* CENTER: sticky calculator widget */}
      <aside className="mt-8 lg:mt-0 lg:col-span-5">
        <div className="sticky top-24">
          <div className="p-4 border rounded-xl">
            <h2>Calculator UI</h2>
            <p>
              This is a scaffold stub for <code>loan-payment</code>. Replace with your real UI.
            </p>
            <form className="mt-4 grid gap-3">
              <label className="block">
                <span className="text-sm font-medium">Example input</span>
                <input
                  className="mt-1 w-full border rounded-md px-3 py-2"
                  placeholder="Enter a value..."
                />
              </label>
              <button type="button" className="px-3 py-2 rounded-md border">
                Compute
              </button>
            </form>
          </div>
        </div>
      </aside>
    </div>
  );
}
