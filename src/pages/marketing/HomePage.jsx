import React from 'react';
import { useMarketingSEO } from '../../utils/seo';
import { HeroSection } from '../../components/marketing/HeroSection';
import { TrustSection } from '../../components/marketing/TrustSection';
import { FeatureGrid } from '../../components/marketing/FeatureGrid';
import { WorkflowSection } from '../../components/marketing/WorkflowSection';
import { ProductShowcase } from '../../components/marketing/ProductShowcase';
import { RoleBenefitsSection } from '../../components/marketing/RoleBenefitsSection';
import { FinancialVisibilitySection } from '../../components/marketing/FinancialVisibilitySection';
import { DashboardReportingSection } from '../../components/marketing/DashboardReportingSection';
import { SecurityArchitectureSection } from '../../components/marketing/SecurityArchitectureSection';
import { FAQAccordion } from '../../components/marketing/FAQAccordion';
import { CTASection } from '../../components/marketing/CTASection';

export const HomePage = () => {
  useMarketingSEO({
    title: 'MedPulse Clinic ERP — One Platform for Smarter Clinic Management',
    description:
      'Manage patient records, appointment queues, digital prescriptions, billing, payments, and clinic expenses from one organized platform.',
  });

  return (
    <div className="space-y-0">
      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: Trust and Value Proposition */}
      <TrustSection />

      {/* Section 3: Core Features */}
      <FeatureGrid showViewAll={true} />

      {/* Section 4: How It Works (Core Clinic Workflow) */}
      <WorkflowSection />

      {/* Section 5: Editorial Product Showcase */}
      <ProductShowcase />

      {/* Section 6: Benefits by Role */}
      <RoleBenefitsSection />

      {/* Section 7: Financial Visibility */}
      <FinancialVisibilitySection />

      {/* Section 8: Reporting and Dashboard */}
      <DashboardReportingSection />

      {/* Section 9: Security and Data Handling */}
      <SecurityArchitectureSection />

      {/* Section 10: Frequently Asked Questions */}
      <FAQAccordion />

      {/* Section 11: Final Conversion CTA */}
      <CTASection />
    </div>
  );
};
