import { FormResponses, BlueprintResult, DeferItem } from '@/types';
import { QUESTIONS } from './questions';

export function calculateBlueprint(responses: FormResponses): BlueprintResult {
  let q1Score = 0;
  let q2Score = 0;
  let q3Score = 0;
  let q4Score = 0;
  let q5Score = 0;
  let q6Score = 0;
  let q7Score = 0;
  let q8Score = 0;
  let q9Score = 0;
  let q10Score = 0;

  // Q1: Product Type
  const q1Obj = QUESTIONS[0].options?.find((o) => o.value === responses.q1_productType || o.label === responses.q1_productType);
  q1Score = q1Obj ? q1Obj.points : 5;

  // Q2: Idea Stage
  const q2Obj = QUESTIONS[1].options?.find((o) => o.value === responses.q2_stage || o.label === responses.q2_stage);
  q2Score = q2Obj ? q2Obj.points : 0;

  // Q3: Target Customer (Heuristic: specific niche vs broad)
  const customerText = (responses.q3_targetCustomer || '').trim().toLowerCase();
  const broadKeywords = ['everyone', 'anyone', 'all businesses', 'small businesses', 'people', 'all companies', 'general', 'consumers'];
  const unsureKeywords = ['not sure', 'unsure', 'dont know', "don't know", 'undecided', 'none', 'tbd'];

  if (!customerText || unsureKeywords.some((w) => customerText.includes(w))) {
    q3Score = 0;
  } else if (broadKeywords.some((w) => customerText === w || customerText.includes(w)) && customerText.length < 25) {
    q3Score = 3;
  } else if (customerText.length >= 4) {
    q3Score = 10;
  } else {
    q3Score = 5;
  }

  // Q4: Problem Solved (Heuristic: clear specific pain point)
  const problemText = (responses.q4_problem || '').trim();
  const problemLower = problemText.toLowerCase();
  if (!problemText || unsureKeywords.some((w) => problemLower.includes(w)) || problemText.length < 8) {
    q4Score = 0;
  } else if (problemText.length >= 35 || problemLower.includes('because') || problemLower.includes('struggle') || problemLower.includes('waste') || problemLower.includes('lose') || problemLower.includes('hard to')) {
    q4Score = 15;
  } else {
    q4Score = 5;
  }

  // Q5: Current Solution (Multi-select)
  const selectedQ5 = responses.q5_currentSolution || [];
  if (selectedQ5.includes('I’m not sure') || selectedQ5.includes('Unsure')) {
    q5Score = 0;
  } else {
    let rawQ5 = 0;
    selectedQ5.forEach((item) => {
      if (item.includes('Spreadsheet')) rawQ5 += 5;
      else if (item.includes('Email') || item.includes('WhatsApp')) rawQ5 += 5;
      else if (item.includes('Multiple disconnected') || item.includes('disconnected')) rawQ5 += 8;
      else if (item.includes('Manual admin')) rawQ5 += 8;
      else if (item.includes('existing tool') || item.includes('fit their needs')) rawQ5 += 8;
    });
    // Cap Q5 at max realistic 16-18 points so it scales well in the 100 pt total
    q5Score = Math.min(rawQ5, 16);
  }

  // Q6: Main Outcome
  const q6Obj = QUESTIONS[5].options?.find((o) => o.value === responses.q6_mainOutcome || o.label === responses.q6_mainOutcome);
  q6Score = q6Obj ? q6Obj.points : 10;

  // Q7: User Journey Workflow
  const journeyText = (responses.q7_userJourney || '').trim();
  const journeyLower = journeyText.toLowerCase();
  if (!journeyText || unsureKeywords.some((w) => journeyLower.includes(w)) || journeyText.length < 15) {
    q7Score = 0;
  } else if (journeyText.length >= 60 || (journeyLower.includes('then') && journeyLower.includes('and')) || journeyLower.includes('logs in') || journeyLower.includes('submits') || journeyLower.includes('receives')) {
    q7Score = 20;
  } else {
    q7Score = 10;
  }

  // Q8: Features Count
  const featureCount = (responses.q8_features || []).length;
  if (featureCount <= 3) {
    q8Score = 10;
  } else if (featureCount <= 7) {
    q8Score = 5;
  } else {
    q8Score = 0;
  }

  // Q9: Timeline
  const q9Obj = QUESTIONS[8].options?.find((o) => o.value === responses.q9_timeline || o.label === responses.q9_timeline);
  q9Score = q9Obj ? q9Obj.points : 5;

  // Q10: Investment Readiness
  const q10Obj = QUESTIONS[9].options?.find((o) => o.value === responses.q10_investment || o.label === responses.q10_investment);
  q10Score = q10Obj ? q10Obj.points : 5;

  // Total Score Calculation (0 - 100 normalized)
  const rawTotal = q1Score + q2Score + q3Score + q4Score + q5Score + q6Score + q7Score + q8Score + q9Score + q10Score;
  const totalScore = Math.min(Math.max(rawTotal, 0), 100);

  // Score Band & Messaging
  let scoreBand: 'low' | 'medium' | 'high' = 'low';
  let bandTitle = 'Idea Needs Clarity';
  let bandMessage = 'Define one user, one problem, and one workflow before building.';
  let ctaText = 'Get feedback on how to clarify your MVP';

  if (totalScore >= 70) {
    scoreBand = 'high';
    bandTitle = 'Ready to Define a Focused MVP';
    bandMessage = 'Turn the core workflow into a concrete 2-week build plan.';
    ctaText = 'Turn this into a two-week build plan';
  } else if (totalScore >= 40) {
    scoreBand = 'medium';
    bandTitle = 'Promising, But Scope Needs Narrowing';
    bandMessage = 'Reduce the first version to one core workflow that delivers immediate value.';
    ctaText = 'Discuss how to narrow your MVP to two weeks';
  }

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/safiyahamedu/book-a-1-1-call-with-safiyah-amedu';

  // 1. Dynamic Product Summary
  const productType = responses.q1_productType || 'web software';
  const targetCustomer = responses.q3_targetCustomer ? responses.q3_targetCustomer.trim() : 'your target customers';
  const problem = responses.q4_problem ? responses.q4_problem.trim() : 'their current manual friction';
  const outcome = responses.q6_mainOutcome || 'streamline their primary workflow';

  const productSummary = `You’re building a ${productType} for ${targetCustomer} who struggle with ${problem}. Your first version should focus on helping them ${outcome}.`;

  // 2. Core Workflow Summary
  const coreWorkflowSummary = responses.q7_userJourney
    ? responses.q7_userJourney.trim()
    : 'User logs in, triggers the core action, completes the workflow, and receives instant confirmation.';

  // 3. Build-First List (Mapped to Main Outcome)
  const buildFirstList: string[] = [];
  const outcomeLower = outcome.toLowerCase();

  if (outcomeLower.includes('booking') || outcomeLower.includes('lead') || outcomeLower.includes('request')) {
    buildFirstList.push('Dedicated request or booking intake flow');
    buildFirstList.push('Real-time status updates & automated email confirmations');
    buildFirstList.push('Clean client & provider overview dashboard');
    buildFirstList.push('Basic notification triggers on status changes');
  } else if (outcomeLower.includes('save time') || outcomeLower.includes('repeated workflow')) {
    buildFirstList.push('Core workflow execution screens (step-by-step)');
    buildFirstList.push('Task & process status tracking state machine');
    buildFirstList.push('Streamlined single-view productivity dashboard');
    buildFirstList.push('Action confirmation alerts');
  } else if (outcomeLower.includes('organize') || outcomeLower.includes('information')) {
    buildFirstList.push('Centralized contact & client record profiles');
    buildFirstList.push('Structured data entry forms with input validation');
    buildFirstList.push('Fast search, tagging, and multi-parameter filtering');
    buildFirstList.push('Clean records management dashboard');
  } else if (outcomeLower.includes('track project') || outcomeLower.includes('job') || outcomeLower.includes('task')) {
    buildFirstList.push('Project & job creation workflow');
    buildFirstList.push('Pipeline stages / task progress tracker');
    buildFirstList.push('Live status update modal & team assignments');
    buildFirstList.push('Central project status dashboard');
  } else if (outcomeLower.includes('automate') || outcomeLower.includes('manual process')) {
    buildFirstList.push('Self-serve intake form with validation');
    buildFirstList.push('Automated workflow pipeline & state router');
    buildFirstList.push('Automated email dispatch upon process completion');
    buildFirstList.push('Admin review & processing screen');
  } else if (outcomeLower.includes('accept payment') || outcomeLower.includes('payment')) {
    buildFirstList.push('Product / service selection catalog step');
    buildFirstList.push('Secure hosted Stripe checkout redirect');
    buildFirstList.push('Immediate payment confirmation & receipt screen');
    buildFirstList.push('Transaction history & fulfillment dashboard');
  } else if (outcomeLower.includes('report') || outcomeLower.includes('insight') || outcomeLower.includes('dashboard')) {
    buildFirstList.push('Data ingestion / manual CSV import module');
    buildFirstList.push('High-level KPI metric cards & summary dashboard');
    buildFirstList.push('Exportable summary report view (PDF / CSV)');
    buildFirstList.push('Note: May require 2+ weeks depending on external API data sources');
  } else {
    buildFirstList.push('Core single-purpose intake or action screen');
    buildFirstList.push('User state & progress tracker');
    buildFirstList.push('Automated notification triggers');
    buildFirstList.push('Clean essentials dashboard');
  }

  // 4. Defer List (Compare selected features against outcome)
  const selectedFeatures = responses.q8_features || [];
  const deferList: DeferItem[] = [];

  const addDefer = (feature: string, reason: string) => {
    if (selectedFeatures.some((f) => f.toLowerCase().includes(feature.toLowerCase()))) {
      deferList.push({ feature, reason });
    }
  };

  if (!outcomeLower.includes('payment')) {
    addDefer('Payments', 'In-app payments can be deferred. Early pilot clients can pay via Stripe invoices, payment links, or bank transfers without building custom billing infrastructure into V1.');
  }

  addDefer('AI features', `AI features can be deferred. They add complexity and are unlikely to be necessary for proving that users genuinely value your core ${outcome} workflow.`);
  addDefer('Mobile app', 'Native mobile app can be deferred. A fast, mobile-responsive web app delivers 95% of mobile utility in version one with zero App Store review cycles or multi-platform codebase delays.');
  addDefer('Reports or analytics', 'Advanced analytics can wait. A basic database counter or table gives all the visibility needed during your initial 10-50 pilot users.');
  addDefer('Admin panel', 'Dedicated custom admin panel can be deferred. You can inspect and manage early records directly via modern backend tooling (e.g. Supabase Studio / Retool) without writing custom admin UI.');
  addDefer('Third-party integrations', 'Deep custom third-party integrations can be deferred. Start with manual triggers or simple Webhooks / Zapier before writing custom API adapters.');
  addDefer('File uploads', 'Custom cloud file pipelines can be deferred. Link directly to Google Drive, Dropbox, or Loom for the first version if files are not the central mechanic.');

  // If deferList is empty (user didn't check complex features), suggest best practices
  if (deferList.length === 0) {
    deferList.push({
      feature: 'Multi-role permission hierarchies',
      reason: 'Keep version one to a single permission level to avoid security matrix complexity.',
    });
    deferList.push({
      feature: 'Custom analytics suite',
      reason: 'Standard product usage counters in your database are all you need for early pilots.',
    });
  }

  // 5. Biggest Risk Diagnosis
  let biggestRisk = 'Your biggest risk is overbuilding before launch. Keep version one tightly focused.';

  const isJustIdea = q2Score === 0;
  const isBroadAudience = q3Score <= 3;
  const hasManyFeatures = featureCount >= 8;
  const isUrgent = responses.q9_timeline?.toLowerCase().includes('soon') || q9Score === 10;
  const hasClearWorkflow = q7Score >= 15;

  if (isJustIdea) {
    biggestRisk = 'Your biggest risk is building before confirming that your target customer wants this workflow. Talk to 5 target users before writing code.';
  } else if (isBroadAudience) {
    biggestRisk = 'Your biggest risk is targeting too broad an audience; narrow it to one specific customer type to maximize conversion and speed.';
  } else if (hasManyFeatures && isUrgent) {
    biggestRisk = 'Your timeline and selected scope do not align. An ambitious feature wishlist will push launch out by months unless you strictly lock version one to the core outcome.';
  } else if (hasManyFeatures) {
    biggestRisk = 'Your biggest risk is scope creep. A smaller, sharper version will be significantly easier to launch, test, and improve.';
  } else if (hasClearWorkflow && isJustIdea) {
    biggestRisk = 'Your biggest risk is assuming the workflow matches what customers will actually use. Validate the steps manually first.';
  } else if (totalScore >= 70) {
    biggestRisk = 'Your biggest risk is overbuilding before launch. Your clarity is high—protect your momentum by refusing to add anything outside your core workflow.';
  }

  // High Fit determination
  const isHighFit = totalScore >= 70 || (totalScore >= 55 && (responses.q10_investment?.includes('ready to invest') || responses.q2_stage?.includes('pre-sales') || responses.q2_stage?.includes('manually')));

  return {
    totalScore,
    scoreBand,
    bandTitle,
    bandMessage,
    ctaText,
    calendlyUrl,
    productSummary,
    coreWorkflowSummary,
    buildFirstList,
    deferList: deferList.slice(0, 4), // Top 3-4 impactful deferrals
    biggestRisk,
    isHighFit,
    scoreBreakdown: [
      { category: 'Idea Validation & Market Demand', score: q2Score + q5Score, maxScore: 40 },
      { category: 'Audience & Problem Clarity', score: q3Score + q4Score, maxScore: 25 },
      { category: 'Workflow & Scope Discipline', score: q6Score + q7Score + q8Score, maxScore: 45 },
      { category: 'Timeline & Investment Readiness', score: q9Score + q10Score, maxScore: 25 },
    ],
  };
}

