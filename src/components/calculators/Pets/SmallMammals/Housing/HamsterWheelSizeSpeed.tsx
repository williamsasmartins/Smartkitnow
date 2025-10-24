import React from "react";

export default function HamsterWheelSizeSpeedEducational() {
  return (
    <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1 className="mb-2">Hamster Wheel Size &amp; Speed (educational)</h1>
      <p className="text-sm opacity-80">Category: pets · Subcategory: small-mammals</p>

      <div className="mt-6 p-4 border rounded-xl">
        <h2>Calculator UI</h2>
        <p>This is a scaffold stub for <code>hamster-wheel-size-speed</code>. Replace with your real UI.</p>
        <form className="mt-4 grid gap-3">
          <label className="block">
            <span className="text-sm font-medium">Example input</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="Enter a value..." />
          </label>
          <button type="button" className="px-3 py-2 rounded-md border">Compute</button>
        </form>
      </div>

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
    </div>
  );
}
