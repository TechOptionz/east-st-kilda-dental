/**
 * Standalone practitioner profiles: /about/<slug>.
 *
 * A profile is built from whatever is filled in below, section by section. A
 * section with no content does not render at all, so the page never shows an
 * empty heading or filler copy.
 *
 * `published` is the one switch for going live. While it is false:
 *   - the page is served but marked noindex, so it can be reviewed in place;
 *   - it is left out of the sitemap and llms.txt;
 *   - no other page links to it (see practitionerPath()), so nothing on the
 *     site leads a visitor or a crawler to an unfinished page;
 *   - the clinician keeps their team-page Person @id (see clinicianId()).
 * Flipping it to true turns all of these on together.
 *
 * Only verified facts belong here. Qualifications, registration numbers,
 * memberships, external profiles and article attributions stay empty until the
 * practice has supplied and confirmed them — an empty list hides its section
 * and its structured data, which is the intended state, not a gap to fill.
 *
 * Paragraphs may carry inline links as [anchor text](/path). Nothing else is
 * parsed: the first-person answers are the practitioner's own words and are
 * reproduced exactly.
 */

import type { IconName } from '@/components/LineIcon'
import type { Review } from '@/components/ReviewMarquee'

export interface Qualification {
  /** e.g. "Bachelor of Dental Science" */
  award: string
  /** e.g. "The University of Melbourne" */
  institution?: string
  year?: string
}

export interface CaseLink {
  label: string
  /** Site-relative, e.g. "/our-work". */
  href: string
}

/** One question and the practitioner's answer, one string per paragraph. */
export interface Answer {
  question: string
  answer: string[]
  /** A follow-on link set under the answer, e.g. to a related service. */
  more?: { lead?: string; label: string; href: string }
}

/** A run of answers under one H2. */
export interface InterviewGroup {
  heading: string
  items: Answer[]
}

export interface Fact {
  label: string
  value: string
  icon: IconName
}

export interface Step {
  title: string
  text: string
  icon: IconName
}

export interface CareArea {
  title: string
  text: string
  href: string
  icon: IconName
}

/** A guide the practitioner genuinely wrote or clinically reviewed. */
export interface Attribution {
  /** Slug in data/articles.ts. Must be a published guide. */
  slug: string
  role: 'written' | 'reviewed'
}

export interface PractitionerProfile {
  /** URL segment under /about, and the key the rest of the site looks it up by. */
  slug: string
  /**
   * Matches `slug` in lib/business.ts `clinicians`, so the Person node on this
   * page is the same entity the home page, team page and article bylines use.
   */
  clinicianSlug: string
  name: string
  /** How the page refers to them in headings and buttons, e.g. "Dr Anbar". */
  shortName: string
  /** The primary role, used wherever one title is shown. */
  jobTitle: string
  /** Every role, in order: the line under the H1 and the schema jobTitle. */
  roles: string[]
  /** Search title and meta description, written for this page alone. */
  meta: { title: string; description: string; ogTitle?: string }
  /** 1200x630 share card under /public. Falls back to the site card. */
  shareImage?: string
  published: boolean
  /**
   * ISO dates for the ProfilePage. Change `dateModified` only when the profile
   * content itself changes — never on a redeploy — and the visible "Profile
   * updated" line follows it.
   */
  datePublished: string
  dateModified: string

  /** Portrait for the hero, under /public. */
  image: string
  imageAlt: string
  objectPosition?: string

  /** The small label above the H1. */
  eyebrow?: string
  /** One or two sentences under the H1. */
  intro?: string
  /** The factual summary under the hero. */
  facts?: Fact[]
  /** First-person answers, introduced as "In <shortName>'s own words". */
  interview?: InterviewGroup[]
  /** What an appointment is like, as a short sequence. */
  appointment?: Step[]
  /** Areas of care, each linked to its service page. Factual, third person. */
  areasOfCare?: CareArea[]
  /** Why they practise here, in their own words. */
  practice?: Answer & { heading: string; links?: CaseLink[] }
  /** Only verified qualifications. Hidden, along with hasCredential, while empty. */
  qualifications?: Qualification[]
  /** AHPRA registration number, if the practice wants it shown. */
  ahpraNumber?: string
  /** Life outside dentistry, in their own words. Do not embellish. */
  outside?: Answer & { heading: string }
  /** Published as knowsAbout. Genuine areas of practice only. */
  knowsAbout?: string[]
  /** Verified external profiles only, published as sameAs. */
  sameAs?: string[]
  /**
   * Service slugs (data/services.ts) whose pages carry a link to this profile.
   * Kept to the treatments the practice has associated with the practitioner,
   * never every service.
   */
  services?: string[]
  /**
   * Google reviews that name this practitioner, copied whole from the
   * practice's Google listing: the reviewer's name as Google shows it, and the
   * text exactly as written, line breaks included. Never shorten, merge,
   * correct or reword one, and never add a review that is not on the listing.
   * No dates: Google only gives relative ones ("4 months ago"), which go stale.
   */
  reviews?: Review[]
  /** Guides they genuinely wrote or reviewed. The section is hidden while empty. */
  articles?: Attribution[]
  /** Future: consented clinical cases. Hidden while empty. */
  cases?: CaseLink[]
  /** The closing call to action. */
  cta?: { heading: string; text: string }
}

export const practitioners: PractitionerProfile[] = [
  {
    slug: 'dr-anbar-ganatra',
    clinicianSlug: 'anbar-ganatra',
    name: 'Dr Anbar Ganatra',
    shortName: 'Dr Anbar',
    jobTitle: 'Principal Dentist',
    roles: ['Principal Dentist', 'General & Cosmetic Dentist'],
    meta: {
      title: 'Dr Anbar Ganatra, Dentist | East St Kilda Dental',
      description:
        'Meet Dr Anbar Ganatra, Principal Dentist and General & Cosmetic Dentist at East St Kilda Dental. Learn about her approach to care, treatment philosophy and background.',
      ogTitle: 'Dr Anbar Ganatra | East St Kilda Dental',
    },
    shareImage: '/assets/social/dr-anbar-ganatra-east-st-kilda-dental.jpg',
    published: true,
    datePublished: '2026-10-02',
    dateModified: '2026-10-02',

    image: '/assets/team/anbar-ganatra.webp',
    imageAlt: 'Dr Anbar Ganatra, Principal Dentist at East St Kilda Dental',
    objectPosition: 'center top',

    eyebrow: 'Meet your dentist',
    intro:
      'Dr Anbar provides comprehensive general, restorative and cosmetic dental care at East St Kilda Dental. Her approach is gentle, considered and focused on helping patients understand what needs attention, what can wait, and how to care for their teeth over the long term.',

    facts: [
      { label: 'Name', value: 'Dr Anbar Ganatra', icon: 'person' },
      { label: 'Role', value: 'Principal Dentist', icon: 'briefcase' },
      { label: 'Clinical practice', value: 'General & Cosmetic Dentistry', icon: 'tooth' },
      { label: 'Practice', value: 'East St Kilda Dental', icon: 'building' },
      { label: 'Location', value: '364 Dandenong Rd, St Kilda East VIC 3183', icon: 'pin' },
      {
        label: 'Areas of care',
        value:
          'General dentistry, restorative dentistry, cosmetic dentistry, porcelain veneers and comprehensive treatment planning',
        icon: 'list',
      },
    ],

    interview: [
      {
        heading: 'Why dentistry?',
        items: [
          {
            question: 'What first drew you to becoming a dentist?',
            answer: [
              "I was drawn to dentistry because of the health side of it, but I was also genuinely fascinated by teeth. They're such a small part of the body, but they affect so much — eating, speaking, health, appearance and confidence.",
              "I liked the combination of healthcare, problem-solving and working with my hands. You can help someone get out of pain, prevent something from becoming worse, rebuild something that's been damaged, or sometimes simply help them feel more comfortable smiling again.",
            ],
          },
          {
            question: 'What interested you in cosmetic and aesthetic dentistry?',
            answer: [
              'What interests me is that a smile can affect much more than the appearance of the teeth themselves.',
              'When somebody feels self-conscious about their smile, it can affect how freely they smile, how they feel in photos and sometimes how confident they feel around other people.',
              "For me, good aesthetic dentistry shouldn't be about creating the same smile for everyone. It should still look like the person. The health, function and structure underneath always matter as well.",
            ],
          },
        ],
      },
      {
        heading: 'How I think about dental care',
        items: [
          {
            question: 'What does good dentistry mean to you?',
            answer: [
              'For me, good dentistry means looking beyond the one tooth that happens to be causing a problem today.',
              'I want to understand the overall health of the mouth — the teeth, gums, bite, existing dental work, habits and what may become a problem in the future.',
              'Then I want the patient to understand it too.',
              "You should leave knowing what needs attention, why it matters, what can safely wait and what your options are. I don't think people should feel pressured into making a decision simply because they're sitting in a dental chair.",
            ],
          },
          {
            question: 'If somebody needs several different treatments, how do you decide where to begin?',
            answer: [
              'I prioritise according to urgency.',
              'If there is an infection, active disease, significant pain or something that could deteriorate quickly, that comes first.',
              "Once we've addressed the urgent problems, I want to stabilise the mouth. Then we can think properly about longer-term restorative or cosmetic treatment.",
              "Trying to rebuild things before the underlying health is stable doesn't make sense to me.",
              'The aim is to create a sequence that is clinically sensible and also manageable for the patient.',
            ],
          },
          {
            question: 'Why is preserving natural teeth important to you?',
            answer: [
              'Whenever it is reasonable to do so, I want to preserve natural teeth and healthy tooth structure.',
              'Dentistry gives us excellent ways to restore or replace teeth when we need to, but your own healthy tooth structure is still valuable.',
              "That's one reason I think treatment should be planned carefully rather than simply treating each tooth in isolation.",
            ],
          },
          {
            question: 'Why do you put so much emphasis on prevention?',
            answer: [
              'Because preventing or treating something while it is small is generally much easier than rebuilding the damage later.',
              "One of the misconceptions people have is that if nothing hurts, everything must be fine. Unfortunately, dental problems don't always work that way.",
              'Decay, gum disease, cracks and other problems can develop without causing significant pain initially.',
              'Regular assessment gives us the chance to identify those things earlier and decide whether they need treatment now, monitoring or simply better prevention.',
            ],
            more: { lead: 'What happens at', label: 'regular dental check-ups', href: '/services/check-ups' },
          },
          {
            question: "If somebody isn't in pain, can there still be something wrong?",
            answer: [
              'Absolutely.',
              "Pain is important, but it's not the only indication that something needs attention.",
              'A tooth can have significant decay, gum disease can progress and old dental work can begin to fail before somebody experiences obvious pain.',
              "That's why I prefer patients to understand what we're seeing rather than waiting until something becomes an emergency.",
            ],
          },
          {
            question: 'Do you see health dentistry and cosmetic dentistry as separate things?',
            answer: [
              'Not always.',
              'There are definitely treatments that are primarily cosmetic, but health, function and appearance overlap a lot more than people realise.',
              "If we're rebuilding damaged teeth, replacing missing teeth or improving the way the bite functions, the result often looks better as well.",
              'And if somebody is considering [cosmetic treatment](/services/smile-design), I still want the gums, teeth and bite underneath to be healthy first.',
            ],
          },
          {
            question: 'What do you most want patients to understand about their teeth?',
            answer: [
              'Probably that looking after things earlier is easier than rebuilding them later.',
              "Small problems can become much bigger if they're ignored.",
              "I also want people to know that having dental problems isn't something to be embarrassed about. Things happen. People get busy, anxious or simply haven't been shown what is going on.",
              'The important thing is understanding where things stand now and deciding what the next sensible step is.',
            ],
          },
          {
            question: "What would you say to somebody who is nervous or hasn't been to a dentist for years?",
            answer: [
              'Just come as you are.',
              "You don't need to apologise and you don't need to know what treatment you need.",
              'The first job is simply to understand what is happening.',
              "I would much rather somebody come in after ten years and let us help them move forward than avoid the dentist for another five years because they're worried about being judged.",
              "We can take things slowly, explain what we're seeing and work out a plan together.",
            ],
            more: { lead: 'Learn more about', label: 'how we care for nervous patients', href: '/nervous-patients' },
          },
        ],
      },
    ],

    appointment: [
      {
        title: 'We start by understanding',
        text: 'Your concerns, dental history and what you want help with come before deciding on treatment.',
        icon: 'chat',
      },
      {
        title: 'We show you what we see',
        text: 'Photos, X-rays and scans can help make problems easier to understand.',
        icon: 'eye',
      },
      {
        title: 'We prioritise',
        text: 'Urgent problems are separated from things that can safely wait.',
        icon: 'list',
      },
      {
        title: 'We explain your options',
        text: 'The aim is informed decisions, not pressure.',
        icon: 'options',
      },
      {
        title: 'We think long term',
        text: 'Where appropriate, treatment is considered as part of the health and function of the whole mouth.',
        icon: 'heart',
      },
    ],

    areasOfCare: [
      {
        title: 'Comprehensive general dentistry',
        text: 'Thorough examinations, preventive care and treatment planning designed to support long-term oral health.',
        href: '/services/check-ups',
        icon: 'tooth',
      },
      {
        title: 'Restorative dentistry',
        text: 'Treatment for damaged, worn or heavily restored teeth with consideration for strength, function and preservation of natural tooth structure.',
        href: '/services/crowns-and-bridges',
        icon: 'shield',
      },
      {
        title: 'Cosmetic & aesthetic dentistry',
        text: "Natural-looking aesthetic care planned around the individual patient's smile, facial features and oral health.",
        href: '/services/smile-design',
        icon: 'sparkle',
      },
      {
        title: 'Porcelain veneers',
        text: "Carefully planned porcelain veneers where they are appropriate for the patient's teeth, oral health and aesthetic goals.",
        href: '/services/veneers',
        icon: 'gem',
      },
      {
        title: 'Comprehensive treatment planning',
        text: 'Prioritising urgent problems, stabilising oral health and developing a staged long-term plan when several areas require attention.',
        href: '/new-patient-comprehensive-care-visit',
        icon: 'steps',
      },
    ],

    practice: {
      heading: 'Why East St Kilda Dental?',
      question: 'What attracted you to East St Kilda Dental?',
      answer: [
        'The family and community feel was a big part of it.',
        'This is a practice that has looked after people in the area for decades, and I liked that relationships mattered.',
        'The philosophy also felt very aligned with how I wanted to practise — comprehensive care, honest communication, looking after people for the long term and not making dentistry feel transactional.',
        'There is something special about caring for patients who have been coming here for years and then meeting their children or other members of their family.',
      ],
      links: [
        // Read as "Learn more about our story and why we're different".
        { label: 'our story', href: '/about/our-story' },
        { label: "why we're different", href: '/about/why-were-different' },
      ],
    },

    // Hidden until the practice supplies verified qualifications.
    qualifications: [],

    outside: {
      heading: 'Outside the practice',
      question: 'What do you enjoy outside dentistry?',
      answer: ['I enjoy going to the gym, swimming and dancing.'],
    },

    knowsAbout: [
      'General dentistry',
      'Restorative dentistry',
      'Cosmetic dentistry',
      'Porcelain veneers',
      'Comprehensive dental care',
      'Preventive dentistry',
    ],
    // No verified external profiles yet.
    sameAs: [],

    services: ['smile-design', 'veneers'],
    // Every review on the Google listing that names Dr Anbar, as of October
    // 2026, bar one: shiva sharifi's, which Google shows cut short ("…").
    reviews: [
      {
        name: "Emily Wootton",
        quote:
          "Dr Anbar was fantastic and extremely knowledgeable.\n\nHer approach is holistic and focuses on long term care, rather than only being reactive.\nShe investigates the connection between your overall health alongside hygiene practices, which is great if you would like to really look after yourself. She is also priced very reasonably, especially considering the level of knowledge she has.\n\nVery comfortable experience as well, from my perspective there was no pain or discomfort.\n\nWould highly recommend to anyone looking for a new dentist.",
      },
      {
        name: "Ja Na",
        quote:
          "Dr Anbar Ganatra and Indiana have been absolutely wonderful.\nAfter experiencing a traumatic extraction in a dental chair years ago, I became terrified of dentists and avoided treatment until my teeth became unbearable. When I finally summoned the courage to seek treatment, I was so anxious that I was shaking and in tears.\n\nFrom the moment I arrived, Dr Anbar was incredibly kind, patient, and understanding. She took the time to explain everything clearly, reassured me, and was very gentle. Indiana held my hand and was compassionate and calming, which helped me feel safe and supported.\n\nI have been blessed to find such an amazing care team and am truly grateful for the care and professionalism I have received. Thank you Anbar and Indiana for looking after me.  If you are looking for an exceptional dental care team, I highly recommend Dr Anbar Ganatra and Indiana—especially to anyone who is nervous or has had a bad dental experience in the past.",
      },
      {
        name: "michael stride",
        quote:
          "Dr Anbar is the most gentle, caring dentist I have been to. Extremely knowledgeable and explained everything very well with my yearly check up. Highly recommend, definitely going back",
      },
      {
        name: "sequana mallinson",
        quote:
          "Dr. Anbar was great! I had been quite naughty and hadn't been to the dentist for a while, Dr. Anbar explained every step, and why we were doing each. I was made to feel comfortable, and Anbar even explained why some proceedures were unnecessary for me. You don't feel as though they are talking you into spending more money as I have experienced with other dentists.\nAll in all, very reasonably priced and great staff.",
      },
      {
        name: "Andrea Buck",
        quote:
          "First up - precision and brilliant quality! Plus my dentist Anbar is so kind, gentle and careful. So I have got a dentist who I can absolutely trust, and also I get to have a friendly and nurturing, very personalized experience when I am in there - and wait for this- after-care as well! You get a call- ‘how are you going? Do you have any issues. Just checking in on you’.\n\nI’m satisfied and delighted with my dental service. I look and feel better than ever from a dentist. Five stars! *****",
      },
      {
        name: "Bhaumik Panchal",
        quote:
          "Dr. Anbar Ganatra provided excellent care during my dad’s tooth extraction. She was professional, kind, and made the whole process as comfortable as possible. We especially appreciated her follow-up phone call to check on his recovery, which showed genuine care for her patients. Highly recommended.",
      },
      {
        name: "Gillian Zaks",
        quote:
          "I saw Dr Anbar for a problem on my palate.She was very helpful and has a very gentle touch.\nI also needed an electronic script and DrAnbar sent it the next day.I appreciate the high standard of this Dental practice.",
      },
      {
        name: "denise burrell",
        quote:
          "Dr Anbar is professional,  efficient & caring,  ensuring that a difficult process was made minimally traumatic for me.  She is ably assisted by her technician Indiana.",
      },
      {
        name: "wilneedheart",
        quote:
          "Fastest and least painful extraction I’ve ever had, from Dr Anbar",
      },
    ],
    // No guides approved as written or reviewed by Dr Anbar yet.
    articles: [],
    cases: [],

    cta: {
      heading: 'Ready to meet Dr Anbar?',
      text: 'Whether something is bothering you, it has been a while since your last visit, or you simply want a clearer picture of your dental health, you can book a visit with Dr Anbar at East St Kilda Dental.',
    },
  },
]

export function getPractitioner(slug: string): PractitionerProfile | undefined {
  return practitioners.find(p => p.slug === slug)
}

export const publishedPractitioners = practitioners.filter(p => p.published)

/**
 * The profile URL for a clinician, only once their profile is published.
 *
 * Every link to a practitioner page goes through this — pass the clinician's
 * display name or their lib/business.ts slug. Until the profile is live it
 * returns undefined and callers render the name as plain text, as before.
 */
export function practitionerPath(nameOrSlug: string | undefined): string | undefined {
  if (!nameOrSlug) return undefined
  const p = publishedPractitioners.find(
    x => x.name === nameOrSlug || x.clinicianSlug === nameOrSlug || x.slug === nameOrSlug,
  )
  return p ? `/about/${p.slug}` : undefined
}

/** Published practitioners associated with a service, for the service page link. */
export function practitionersForService(serviceSlug: string): PractitionerProfile[] {
  return publishedPractitioners.filter(p => p.services?.includes(serviceSlug))
}
