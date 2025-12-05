export default function EmpowermentSection() {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12 cv-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center skn-home-title mb-12">
          Empowering Better Decisions Through Accurate Calculations
        </h2>

        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold skn-title mb-4">For Professionals & Contractors</h3>
              <p className="text-muted-foreground mb-4">
                Construction professionals rely on Smart Kit Now for accurate material estimates, cost calculations, 
                and project planning. Our construction calculators help you minimize waste, stay within budget, and 
                deliver projects on time. From concrete volume to lumber calculations, we've got you covered.
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Reduce material waste by up to 15% with accurate estimates</li>
                <li>• Save time on complex calculations</li>
                <li>• Improve project profitability through better planning</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold skn-title mb-4">For Health & Fitness Enthusiasts</h3>
              <p className="text-muted-foreground mb-4">
                Take control of your health journey with our comprehensive health calculators. Whether you're tracking 
                your BMI, calculating daily calorie needs, or monitoring your fitness progress, our tools provide 
                the insights you need to make informed decisions about your health and wellness.
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Track your health metrics accurately</li>
                <li>• Set realistic fitness and nutrition goals</li>
                <li>• Monitor progress over time</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold skn-title mb-4">For Financial Planning</h3>
              <p className="text-muted-foreground mb-4">
                Make smarter financial decisions with our suite of financial calculators. From loan payments and 
                mortgage calculations to investment returns and retirement planning, we help you understand the 
                financial impact of your decisions before you make them.
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Compare loan options and payment schedules</li>
                <li>• Plan for major purchases and investments</li>
                <li>• Understand compound interest and growth</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold skn-title mb-4">For Students & Educators</h3>
              <p className="text-muted-foreground mb-4">
                Students and teachers use Smart Kit Now to verify homework answers, explore mathematical concepts, 
                and solve real-world problems. Our calculators serve as both learning tools and practical resources 
                for academic success across multiple subjects and grade levels.
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Verify calculations and check homework</li>
                <li>• Learn through interactive examples</li>
                <li>• Explore mathematical relationships</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
