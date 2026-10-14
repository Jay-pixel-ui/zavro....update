// Publish an article by adding a record with published: true after review.
// Fields: slug, metaTitle (optional, ≤65 chars for the <title>), title, description, category, author, publishedAt, updatedAt, answer, body: [{h, p: []}], checklist, relatedServices
export const CATEGORIES = ["AI & automation", "Web & software", "Search & GEO", "Brand & strategy"];

export const INSIGHTS = [
  {
    slug: "ai-automation-for-singapore-smes",
    metaTitle: "AI automation for Singapore SMEs: where it helps | Zavro Solutions",
    published: true,
    title: "AI automation for Singapore SMEs: where it helps, and where it doesn't",
    description: "A practical guide for Singapore SMEs on choosing what to automate, when to use rules instead of AI, how to handle data under the PDPA, and how to start small.",
    category: "AI & automation",
    author: "Zavro Solutions team",
    publishedAt: "2026-10-14",
    updatedAt: null,
    readMinutes: 6,
    answer: "AI automation is most useful for an SME when it takes over repetitive, well-understood steps — sorting enquiries, updating records, drafting routine replies — while a person keeps the decisions that carry risk. Start with one process you can describe step by step, use simple rules wherever they're enough, and add AI only where content needs interpreting.",
    body: [
      { h: "Start with the process, not the tool", p: [
        "Most automation projects that disappoint begin with a product: \"we should use an AI agent\". The ones that work begin with a process someone can describe out loud — where the work arrives, who touches it, what they check, and where it ends up.",
        "Write that down before choosing anything. If the team can't agree how the process works today, automating it will only make the disagreement faster.",
      ] },
      { h: "Rules first, AI second", p: [
        "A rules-based workflow follows fixed steps: when a form is submitted, create a CRM record, tag it by service and notify the right person. It is predictable, cheap to run and easy to test.",
        "AI earns its place where the input is messy — free-text enquiries, emails, documents — and something has to be interpreted: what is this person asking for, how urgent is it, which fields belong where. Even then, AI usually works best as one step inside a rules-based flow, not as the whole system.",
      ] },
      { h: "Good first candidates", p: [
        "Enquiry triage: classify incoming messages by service and urgency, then route them, so nothing waits in a shared inbox.",
        "Record keeping: move details from forms, WhatsApp or email into your CRM or spreadsheet once, instead of retyping them.",
        "Draft replies: prepare a first response or quotation outline for a person to check and send.",
        "Document handling: extract fields from invoices, forms or delivery notes, with anything uncertain flagged for review.",
        "Internal knowledge search: let staff ask questions of approved internal documents rather than hunting through folders.",
      ] },
      { h: "What not to automate", p: [
        "Keep a person in charge of anything with financial, legal, safety or significant customer impact — approving refunds, giving technical safety advice, committing to prices or deadlines.",
        "Avoid automating a process that is still changing every month, or one you have no way to monitor. If you wouldn't notice it failing, it isn't ready to run on its own.",
      ] },
      { h: "Data, access and the PDPA", p: [
        "Automation moves personal data between systems, so Singapore's Personal Data Protection Act (PDPA) applies to how you collect, use, protect and retain it. Be clear about the purpose, tell people how their data is used, and keep it no longer than you need.",
        "Give each automation the minimum access it needs, keep credentials in your own accounts where possible, and check where any AI service processes and stores the data you send it. If a tool can't answer that clearly, don't send it customer data.",
      ] },
      { h: "Design for failure", p: [
        "Every automation will eventually meet an input it doesn't understand or a service that is down. Decide in advance what happens: the item goes to a named person, an alert is sent, and the step is logged so you can see what happened.",
        "For AI steps, set a confidence threshold. Above it, the flow continues; below it, a person reviews. Review those exceptions regularly — they show you where the process or the instructions need improving.",
      ] },
      { h: "A sensible way to start", p: [
        "Pick one process that is frequent, repetitive and low-risk. Note roughly how long it takes today and how often it goes wrong. Build the smallest version that removes the most tedious step, run it alongside the manual process for a short pilot, then compare.",
        "If it helps, extend it. If it doesn't, you have learned something useful at low cost — which is a better outcome than a large system nobody trusts.",
      ] },
    ],
    checklist: ["Can we describe the process step by step?", "Would simple rules be enough?", "Where does a person approve or review?", "What happens when it fails, and who is told?", "What data does it touch, and is that use covered by our privacy notice?", "How will we know it's working?"],
    relatedServices: ["ai-automation", "software-development", "business-consulting"],
  },
  {
    slug: "geo-ai-search-visibility-guide",
    metaTitle: "GEO explained: make your business understandable to AI | Zavro Solutions",
    published: true,
    title: "GEO explained: how to make your business understandable to AI search",
    description: "GEO in plain English for Singapore businesses: how AI answer tools find content, what helps them understand you, what to avoid and how to measure it.",
    category: "Search & GEO",
    author: "Zavro Solutions team",
    publishedAt: "2026-10-14",
    updatedAt: null,
    readMinutes: 6,
    answer: "Generative Engine Optimization (GEO) is the work of making your business easy for AI answer tools to understand and, where relevant, cite. In practice it builds on good SEO: consistent business facts, clear answer-first pages, original evidence and crawlable content. Nobody can guarantee that ChatGPT, Google's AI features or Perplexity will mention you.",
    body: [
      { h: "What GEO is — and isn't", p: [
        "When someone asks an AI tool \"who builds e-commerce sites in Singapore?\" or \"what should I check before hiring an electrician?\", the answer is assembled from sources the tool can access and trusts. GEO is about being one of those clear, trustworthy sources.",
        "It isn't a trick. Hidden text, keyword stuffing or pages written only for bots tend to make content less useful to people, and search systems are designed to discount that kind of material.",
      ] },
      { h: "How AI answer tools find content", p: [
        "Most AI search experiences rely on web crawling and search indexes. OpenAI, for example, documents a crawler called OAI-SearchBot for ChatGPT search, separate from GPTBot, which relates to model training — so you can allow one and block the other in robots.txt.",
        "Google states that its AI features in Search draw on the same foundations as Search itself, and that there are no extra technical requirements beyond normal SEO best practice. In other words: if search engines can't crawl and understand a page, AI answers built on them are unlikely to use it.",
      ] },
      { h: "1. Make your business facts consistent", p: [
        "Your name, what you do, where you're based, who you serve and how to contact you should read the same on your website, business profiles and social accounts. Inconsistent details make it harder for any system to be confident it's describing the right business.",
      ] },
      { h: "2. Answer first, then explain", p: [
        "Open important pages with a direct, plain-English answer: what the service is, who it's for and what problem it solves. Then expand with specifics, limitations and FAQs. This helps people skimming on a phone, and it gives answer engines a clean passage to understand.",
      ] },
      { h: "3. Publish evidence only you have", p: [
        "Generic content is easy to replace. What's hard to replace is first-hand material: real project descriptions (with permission), specific processes, honest limitations, and expertise from doing the work in your market. Publish facts you can stand behind, and be precise about what is verified.",
      ] },
      { h: "4. Keep it crawlable and structured", p: [
        "Important text should be real HTML text, not only inside images, PDFs or animations. Use clear headings, descriptive links and structured data that matches what's visible on the page. Decide your crawler policy deliberately rather than allowing or blocking everything by default.",
      ] },
      { h: "How to measure it", p: [
        "Measurement is partial. In your analytics you can watch for referral traffic from AI tools such as chatgpt.com or perplexity.ai, and you can periodically ask common customer questions in different tools to see how your business is described. Treat these as signals, not a ranking report — results vary by tool, by phrasing and over time.",
      ] },
      { h: "What to avoid", p: [
        "Avoid anyone promising guaranteed placement in AI answers, mass-produced pages targeting every suburb, fake reviews or unverifiable statistics. Besides being unreliable, they can damage the trust that both people and search systems place in your site.",
      ] },
    ],
    checklist: ["Are our business name, services, location and contact details consistent everywhere?", "Does each key page start with a direct answer?", "Do we publish original, verifiable evidence?", "Is important text crawlable HTML?", "Does our structured data match the visible page?", "Have we decided which crawlers to allow?"],
    relatedServices: ["geo", "seo", "digital-marketing"],
  },
];

export const publishedInsights = () =>
  INSIGHTS.filter((a) => a.published).sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
