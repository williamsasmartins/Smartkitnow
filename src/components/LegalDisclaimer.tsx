import React from "react";
import { ShieldAlert, Info } from "lucide-react";

export default function LegalDisclaimer() {
  return (
    <div className="my-8 p-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
      {/* Header com Icon */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
          <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            Important — Educational Use Only
          </h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              <strong>This calculator is provided for educational and informational purposes only.</strong> The results are estimates based on the information you provide and should not be considered financial, legal, or professional advice.
            </p>
            
            <div className="flex items-start gap-2 bg-white dark:bg-gray-900 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-xs">
                <p>
                  <strong className="text-amber-700 dark:text-amber-400">No Warranty:</strong> SmartKitNow makes no warranties regarding the accuracy, completeness, or reliability of the calculations. Results may vary based on individual circumstances, market conditions, and other factors.
                </p>
                <p>
                  <strong className="text-amber-700 dark:text-amber-400">Professional Advice:</strong> Always consult with qualified professionals (financial advisors, accountants, attorneys, or other specialists) before making any important financial or legal decisions.
                </p>
                <p>
                  <strong className="text-amber-700 dark:text-amber-400">Limitation of Liability:</strong> SmartKitNow and its affiliates are not liable for any losses, damages, or consequences resulting from the use of this calculator or reliance on its results.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
              By using this calculator, you acknowledge that you have read and understood this disclaimer, and you agree to use the tool at your own risk. For personalized guidance tailored to your specific situation, please seek advice from a qualified professional in the relevant field.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
        <p className="text-xs text-center text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
          <span>📋</span>
          <span>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </p>
      </div>
    </div>
  );
}
