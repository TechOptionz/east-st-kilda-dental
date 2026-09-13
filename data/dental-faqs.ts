import { business, fullAddress } from '@/lib/business'

/**
 * The dental FAQ library behind /dental-faqs.
 *
 * One source for three outputs: the visible accordions, the FAQPage structured
 * data, and — by id — deep links from any other page on the site
 * (/dental-faqs#what-is-a-dental-implant opens that answer). Treat the ids as
 * public URLs: rewording a question changes its id, so keep an old question's
 * wording unless the answer has genuinely changed.
 *
 * Answers are written in a tiny markup so the page can link phrases while the
 * schema still gets plain text:
 *   [link text](/internal-path)   → a Next <Link>
 *   [link text](https://…)        → an external link, opened in a new tab
 *   a blank line                  → a new paragraph
 * Nothing else is interpreted. See components/FaqAnswer.tsx.
 *
 * Time-sensitive answers are marked REVIEW below. The CDBS figures in
 * particular are indexed every 1 January and must be checked against Services
 * Australia each year.
 */

export interface DentalFaq {
  q: string
  a: string
}

export interface DentalFaqCategory {
  /** The section's anchor, e.g. /dental-faqs#dental-implants. */
  id: string
  title: string
  faqs: DentalFaq[]
}

/** When the answers were last updated. Shown on the page and used as dateModified. */
export const FAQ_LAST_UPDATED = { label: 'September 2026', iso: '2026-09-13' }

/**
 * The clinician who has reviewed these answers, by their slug in
 * lib/business.ts — or null until one has.
 *
 * Deliberately null: "Reviewed by Dr …" is a professional claim, so it is only
 * shown once the practice confirms which dentist has actually read and signed
 * off this content. Setting it adds the byline to the page and reviewedBy to
 * the structured data.
 */
export const FAQ_REVIEWER: string | null = null

const HEALTHDIRECT_TOOTHACHE = 'https://www.healthdirect.gov.au/toothache-and-gum-swelling'
const CDBS_COVER = 'https://www.servicesaustralia.gov.au/whats-covered-child-dental-benefits-schedule'
const CDBS_HOW_TO = 'https://www.servicesaustralia.gov.au/how-to-use-child-dental-benefits-schedule'

export const faqCategories: DentalFaqCategory[] = [
  {
    id: 'first-visits',
    title: 'First Visits & Choosing a Dentist',
    faqs: [
      {
        q: 'What happens at a first dental appointment?',
        a: `A first dental appointment usually begins with a discussion about your dental history, concerns and goals, followed by an examination of your teeth, gums and mouth. X-rays may be recommended where clinically appropriate. At ${business.name}, our [New Patient Comprehensive Care Visit](/new-patient-comprehensive-care-visit) is designed to give you a clear picture of your dental health and prioritised next steps.`,
      },
      {
        q: 'How long does a new patient dental appointment take?',
        a: 'The length depends on the type of appointment and what needs to be assessed. Our New Patient Comprehensive Care Visit typically allows 60–75 minutes, giving your dentist time to examine your dental health, listen to your concerns and explain your options without rushing.',
      },
      {
        q: 'What should I tell my dentist at my first appointment?',
        a: 'Tell your dentist about any pain, sensitivity, bleeding gums, past dental treatment, medical conditions, medications, dental anxiety and anything you would like to improve about your smile. Even something that seems minor can be useful information.',
      },
      {
        q: "What if I haven't been to the dentist for years?",
        a: 'You can simply start from where you are now. A long gap between dental visits is common, and there is no benefit in feeling embarrassed about it. Your dentist can assess your current dental health, identify priorities and help you work through treatment at a manageable pace.',
      },
      {
        q: 'Will a dentist judge me if my teeth are bad?',
        a: `A good dental team should focus on helping you rather than judging how your teeth became the way they are. At ${business.name}, [our approach](/nervous-patients) is specifically designed around no judgement, clear explanations and helping patients regain control of their dental health.`,
      },
      {
        q: 'How do I know if I have chosen a good dentist?',
        a: 'Look beyond price alone. Consider how thoroughly the dentist assesses your health, whether they explain your options clearly, whether you feel listened to, the experience of the clinicians, patient reviews, continuity of care and whether you feel pressured into treatment.',
      },
      {
        q: 'Can I get a second opinion from another dentist?',
        a: 'Yes. You can seek another dental opinion if you are unsure about a diagnosis, proposed treatment or treatment plan. Bring any relevant X-rays or records if available so the second dentist has as much useful information as possible.',
      },
    ],
  },
  {
    id: 'tooth-pain-emergencies',
    title: 'Tooth Pain, Symptoms & Dental Emergencies',
    faqs: [
      {
        q: 'Is toothache a dental emergency?',
        a: `It can be. Persistent or severe toothache may indicate decay, infection, a cracked tooth or another problem requiring treatment. [Healthdirect recommends](${HEALTHDIRECT_TOOTHACHE}) seeing a dentist promptly if toothache lasts more than two days or does not improve with pain relief.`,
      },
      {
        q: 'When should I see a dentist urgently?',
        a: `Seek prompt dental care for symptoms such as significant tooth pain, facial or gum swelling, pain when biting, dental trauma, a broken tooth or a bad taste associated with swelling or pain. Our [emergency dentist](/emergency-dentist) page explains what to do next.\n\nIf dental swelling causes difficulty breathing or speaking, or swelling around the eye or neck, [seek emergency medical care](${HEALTHDIRECT_TOOTHACHE}) rather than waiting for a routine dental appointment.`,
      },
      {
        q: 'Why does my tooth hurt when I bite?',
        a: 'Pain when biting can have several causes, including a cracked tooth, tooth decay, inflammation around the tooth, a damaged filling or problems involving the [dental nerve](/services/root-canal). An examination and sometimes an X-ray are needed to identify the cause.',
      },
      {
        q: 'Why is my tooth sensitive to cold?',
        a: 'Cold sensitivity may occur because of exposed tooth surfaces, gum recession, enamel wear, decay, cracks or problems with an existing filling. Brief sensitivity and lingering pain can mean different things, so persistent sensitivity should be assessed.',
      },
      {
        q: 'Why does my tooth hurt at night?',
        a: 'Dental pain can feel more noticeable at night, but persistent night-time toothache can also occur with inflammation or infection inside a tooth. If pain is severe, recurring or disturbing your sleep, arrange a dental examination.',
      },
      {
        q: 'Why are my gums swollen around one tooth?',
        a: 'Localised swelling can occur because of gum inflammation, trapped food, infection, a problem with the tooth underneath or a partially erupted [wisdom tooth](/services/extractions-wisdom-teeth). Persistent swelling should be examined rather than repeatedly treating the symptom at home.',
      },
      {
        q: 'Why do I have a bad taste coming from one tooth?',
        a: 'A persistent unpleasant taste near a particular tooth can sometimes occur with infection or drainage around a tooth or gum. If it occurs with pain, swelling or fever, seek dental assessment promptly.',
      },
      {
        q: 'What should I do if I break a tooth?',
        a: 'Avoid chewing on the damaged area and arrange a dental assessment. Whether the tooth needs smoothing, bonding, a [filling](/services/fillings), [crown](/services/crowns-and-bridges) or another treatment depends on how much tooth structure has been damaged.',
      },
      {
        q: 'What should I do if a filling falls out?',
        a: 'Keep the area clean, avoid biting hard foods on the affected tooth and arrange an appointment. A lost filling can expose weakened tooth structure and may allow the tooth to deteriorate further.',
      },
      {
        q: 'What should I do if my crown comes off?',
        a: 'Keep the crown if you still have it and contact your dentist. Do not use household glue to reattach it. Your dentist will assess whether the crown can be recemented or whether the tooth or restoration requires further treatment.',
      },
      {
        q: 'What should I do if a permanent tooth is knocked out?',
        a: 'A knocked-out adult tooth is time-sensitive. Handle it by the crown rather than the root and seek [urgent dental care](/emergency-dentist) immediately. Contact the dental clinic while you are on your way so they can advise you appropriately.',
      },
    ],
  },
  {
    id: 'nervous-patients',
    title: 'Nervous Patients & Dental Anxiety',
    faqs: [
      {
        q: "What if I'm scared of the dentist?",
        a: 'Tell the dental team before treatment starts. Your appointment can often be adapted with slower pacing, explanations before treatment, agreed stop signals, breaks and [other comfort measures](/nervous-patients).',
      },
      {
        q: 'Is dental anxiety common?',
        a: 'Yes. People can feel anxious about dental care for many reasons, including previous experiences, fear of pain or needles, embarrassment, sounds and smells, or feeling that they are not in control.',
      },
      {
        q: 'Can I stop the dentist during treatment?',
        a: `Yes. Agreeing on a stop signal before treatment can give you greater control. At ${business.name}, nervous patients are encouraged to communicate if they need a pause or break.`,
      },
      {
        q: "Can I bring someone with me if I'm nervous?",
        a: 'Often, yes. Let the clinic know when booking if having a support person with you would make the appointment easier.',
      },
      {
        q: 'Do you offer happy gas for nervous patients?',
        a: `${business.name} offers nitrous oxide, commonly called happy gas, where it is clinically suitable. It can help some patients feel more relaxed during treatment. Your dentist will assess whether it is appropriate for you.`,
      },
      {
        q: "What if I've had a bad experience with a dentist before?",
        a: 'Tell your new dentist what happened and what made the experience difficult. That information can help them adjust communication, pacing and treatment so your next experience is different.',
      },
      {
        q: "What if I'm embarrassed about how my teeth look?",
        a: 'You do not need to fix your teeth before seeing a dentist. The purpose of the appointment is to work out where things stand and what can be done from here.',
      },
    ],
  },
  {
    id: 'check-ups-prevention',
    title: 'Check-ups, Cleaning & Prevention',
    faqs: [
      {
        q: 'How often should I have a dental check-up?',
        a: 'There is no single interval that is right for everyone. How often you should be examined depends on factors such as your dental history, gum health, decay risk, existing treatment and overall health. Your dentist can recommend an appropriate [check-up](/services/check-ups) interval for you.',
      },
      {
        q: 'Do I need a dental clean every six months?',
        a: 'Not necessarily. The appropriate frequency of [professional cleans](/services/cleans-and-hygiene) depends on how quickly plaque and calculus accumulate, gum health, home cleaning and individual risk factors.',
      },
      {
        q: 'Why do dentists take X-rays?',
        a: 'Dental X-rays can show areas that cannot be properly assessed by looking in the mouth alone, such as decay between teeth, bone levels, tooth roots and some infections. They should be taken when clinically justified rather than automatically.',
      },
      {
        q: 'Does bleeding when I brush mean I have gum disease?',
        a: 'Bleeding gums are commonly associated with inflammation and should not simply be ignored. Gingivitis, periodontal disease and other local factors can cause bleeding, so persistent symptoms should be assessed.',
      },
      {
        q: 'Can gum disease be reversed?',
        a: 'Early gum inflammation can often improve considerably with professional care and effective home cleaning. More advanced periodontal disease causes loss of supporting tissues and generally requires ongoing management rather than simply being “cured.”',
      },
      {
        q: 'Why do my gums bleed when I floss?',
        a: 'Inflamed gums often bleed when disturbed. Regular effective cleaning may improve mild inflammation, but persistent bleeding, swelling, recession or bad breath should be assessed by a dentist or hygienist.',
      },
      {
        q: 'What causes bad breath?',
        a: 'Common causes include plaque, gum disease, tongue coating, dry mouth, food and smoking. Some medical conditions can also contribute. Persistent bad breath deserves assessment rather than simply being covered with mouthwash.',
      },
      {
        q: 'Does brushing harder clean teeth better?',
        a: 'No. Brushing too aggressively can damage gums and contribute to tooth wear. Effective technique is more important than excessive pressure.',
      },
    ],
  },
  {
    id: 'fillings-crowns-root-canal',
    title: 'Fillings, Crowns & Root Canal Treatment',
    faqs: [
      {
        q: 'How do I know if I need a filling?',
        a: 'A [filling](/services/fillings) may be recommended when decay or damage has created a defect in a tooth that cannot simply be monitored. Your dentist will consider the size, location and progression of the problem before recommending treatment.',
      },
      {
        q: 'Does every cavity need a filling?',
        a: 'Not always. Very early changes may sometimes be managed preventively depending on their location and progression. Once tooth structure has broken down significantly, restorative treatment is more likely to be required.',
      },
      {
        q: 'How long do dental fillings last?',
        a: 'There is no guaranteed lifespan. Longevity depends on the size and location of the filling, material used, bite forces, oral hygiene, diet, grinding habits and the remaining strength of the tooth.',
      },
      {
        q: 'When does a tooth need a crown?',
        a: 'A [crown](/services/crowns-and-bridges) may be recommended when a tooth has become significantly weakened, cracked, heavily filled or has undergone certain types of treatment. The goal is generally to protect and restore the remaining tooth.',
      },
      {
        q: 'What is a dental crown?',
        a: 'A dental crown is a custom restoration that covers and protects a damaged or weakened tooth. Crowns can be made from different materials depending on the tooth, bite, appearance requirements and clinical situation.',
      },
      {
        q: 'Why would I need root canal treatment?',
        a: '[Root canal treatment](/services/root-canal) may be recommended when the pulp inside a tooth becomes irreversibly inflamed or infected. The treatment removes affected tissue from inside the tooth and allows the tooth to be retained where appropriate.',
      },
      {
        q: 'Does root canal treatment hurt?',
        a: 'Modern local anaesthetic is intended to keep the tooth comfortable during treatment. Many people actually seek root canal treatment because the tooth is already causing significant pain.',
      },
      {
        q: 'Is it better to save a tooth or remove it?',
        a: 'When a natural tooth can be predictably restored and maintained, preserving it is often desirable. However, there are circumstances where [extraction](/services/extractions-wisdom-teeth) may be the more appropriate option. The decision depends on the condition of the tooth, surrounding tissues, prognosis and your preferences.',
      },
    ],
  },
  {
    id: 'wisdom-teeth',
    title: 'Wisdom Teeth',
    faqs: [
      {
        q: 'Do all wisdom teeth need to be removed?',
        a: 'No. Wisdom teeth that are healthy, functional and not causing disease may not require removal. [Extraction](/services/extractions-wisdom-teeth) may be recommended when they cause repeated infection, decay, damage to neighbouring teeth or other problems.',
      },
      {
        q: 'Why does my wisdom tooth hurt?',
        a: 'Pain can arise from inflammation of the gum around a partially erupted tooth, decay, infection, pressure or other local problems. An examination and sometimes imaging are needed to determine the cause.',
      },
      {
        q: 'Is wisdom tooth swelling an emergency?',
        a: 'Swelling associated with significant pain, fever, difficulty opening the mouth or spreading facial swelling should be assessed promptly. Breathing or swallowing difficulty requires urgent medical attention.',
      },
    ],
  },
  {
    id: 'dental-implants',
    title: 'Missing Teeth & Dental Implants',
    faqs: [
      {
        q: 'What are my options for replacing a missing tooth?',
        a: 'Depending on your situation, options can include a [dental implant](/services/dental-implants), [bridge](/services/crowns-and-bridges) or [removable denture](/services/dentures). In some cases, leaving the space may also be an option. The best approach depends on the location, bone and gum health, neighbouring teeth, bite and personal preferences.',
      },
      {
        q: 'What is a dental implant?',
        a: 'A dental implant is a fixture placed into the jawbone to support a replacement tooth or teeth. After healing, a dental crown, bridge or other restoration can be attached to the implant.',
      },
      {
        q: 'How long do dental implants last?',
        a: 'Dental implants can function for many years, but no implant can be guaranteed for life. Long-term success depends on factors including gum health, cleaning, smoking, medical conditions, bite forces and regular professional maintenance.',
      },
      {
        q: 'Does getting a dental implant hurt?',
        a: 'Implant placement is generally performed with local anaesthetic. Some soreness or swelling can occur afterwards. Your dentist or implant clinician will discuss expected recovery and pain management with you.',
      },
      {
        q: 'Can everyone have dental implants?',
        a: 'No. Suitability depends on factors including available bone, gum health, medical history, smoking, medications and the proposed restoration. Assessment and imaging are needed before deciding whether implants are appropriate.',
      },
      {
        q: "What happens if I don't replace a missing tooth?",
        a: 'Sometimes nothing urgently problematic happens, while in other situations nearby teeth may move, chewing can change or the loss can affect appearance and function. Whether replacement is recommended depends on the individual situation.',
      },
    ],
  },
  {
    id: 'cosmetic-dentistry',
    title: 'Cosmetic Dentistry & Smile Improvements',
    faqs: [
      {
        q: 'What is cosmetic dentistry?',
        a: 'Cosmetic dentistry refers to dental treatment aimed partly or primarily at improving the appearance of the teeth and smile. It may include [whitening](/services/teeth-whitening), [veneers](/services/veneers), bonding, crowns, aligners and combinations of treatments.',
      },
      {
        q: "What's the best way to improve my smile?",
        a: 'There is no single best treatment. The right approach depends on what you want to change — colour, shape, position, spacing, wear, missing teeth or several issues together. A [cosmetic consultation](/services/smile-design) should begin with understanding your goals rather than prescribing a particular procedure.',
      },
      {
        q: 'What are dental veneers?',
        a: '[Veneers](/services/veneers) are thin restorations placed over the visible surface of selected teeth to alter characteristics such as shape, colour, proportions or minor irregularities.',
      },
      {
        q: 'Do veneers damage your teeth?',
        a: 'The amount of tooth preparation varies significantly depending on the veneer type and clinical situation. Some cases require little preparation while others require more. Your dentist should explain how much natural tooth structure would need to be altered before treatment.',
      },
      {
        q: 'How long do veneers last?',
        a: 'Veneers do not have a guaranteed lifespan. Their longevity depends on material, bite, tooth preparation, grinding, oral hygiene and how they are maintained.',
      },
      {
        q: 'Is professional teeth whitening better than supermarket whitening?',
        a: '[Professional whitening](/services/teeth-whitening) allows a dentist to first assess whether whitening is suitable and identify issues such as decay, gum problems or restorations that will not whiten. The appropriate option depends on your teeth and desired result.',
      },
      {
        q: 'Will whitening work on crowns, fillings or veneers?',
        a: 'Whitening products primarily change the colour of natural tooth structure. Existing crowns, veneers and tooth-coloured fillings generally do not lighten in the same way, which can affect colour matching.',
      },
      {
        q: 'Can crooked teeth be improved without veneers?',
        a: 'Yes. Depending on the problem, orthodontic treatment such as [clear aligners](/services/invisalign) or [braces](/services/braces) may reposition natural teeth without covering them with restorations.',
      },
    ],
  },
  {
    id: 'clear-aligners',
    title: 'Invisalign, Clear Aligners & Teeth Straightening',
    faqs: [
      {
        q: 'What are clear aligners?',
        a: '[Clear aligners](/services/invisalign) are removable orthodontic appliances designed to gradually move teeth through a planned series of trays.',
      },
      {
        q: 'Is Invisalign the same as clear aligners?',
        a: 'Invisalign is one brand of clear aligner treatment. Other clear aligner systems also exist.',
      },
      {
        q: 'Am I suitable for clear aligners?',
        a: 'Suitability depends on the type and complexity of tooth movement required, your bite, dental health and your ability to wear the aligners as instructed. An orthodontic assessment is required.',
      },
      {
        q: 'How long does Invisalign or clear aligner treatment take?',
        a: 'Treatment time varies substantially depending on how much movement is required and how consistently aligners are worn. Your clinician can estimate the expected duration after assessing your teeth and bite.',
      },
      {
        q: 'Do I need retainers after straightening my teeth?',
        a: 'Retention is generally an important part of orthodontic treatment because teeth can move after active treatment finishes. Your clinician will recommend an appropriate retainer plan.',
      },
    ],
  },
  {
    id: 'costs-health-funds',
    title: 'Dental Costs, Health Funds & Payment',
    faqs: [
      {
        q: 'How much does a dentist cost in Melbourne?',
        a: 'Dental fees vary according to the treatment required, complexity, time involved, materials, laboratory costs and other factors. A reliable quote for treatment generally requires an examination first. Our [fees & health funds](/fees) page explains how we price and estimate treatment.',
      },
      {
        q: 'Can a dentist tell me exactly what treatment will cost before I start?',
        a: 'For planned treatment, your dentist can generally provide a treatment plan and estimated fees once they have assessed your teeth and determined what is required. Some treatment can change if unexpected clinical findings arise.',
      },
      {
        q: 'Does private health insurance cover dental treatment?',
        a: 'Many Australian extras policies provide benefits for eligible dental services, but rebates, limits and exclusions vary significantly between policies. Check directly with your fund for your individual cover.',
      },
      {
        q: `Does ${business.name} accept health funds?`,
        a: `${business.name} welcomes patients from [major Australian health funds](/fees#funds) and can process eligible claims through HICAPS. Your rebate and out-of-pocket amount depend on your individual policy.`,
      },
      {
        q: 'Does Medicare cover dental treatment?',
        a: 'Routine private dental treatment for adults is generally not funded through standard Medicare. Some children may qualify for the Child Dental Benefits Schedule, and eligible Australians may have access to public dental services.',
      },
      // REVIEW every January: the cap is indexed on 1 January.
      {
        q: 'What is the Child Dental Benefits Schedule?',
        a: `The [Child Dental Benefits Schedule](${CDBS_COVER}) (CDBS) is an Australian Government program that helps eligible children aged 0–17 with the cost of certain basic dental services. For a new benefit period beginning in 2026, eligible children can access up to $1,158 over two consecutive calendar years. Covered services can include examinations, X-rays, cleans, fillings, root canals and extractions; orthodontic and cosmetic treatment are not covered.`,
      },
      // REVIEW every January alongside the answer above.
      {
        q: "How can I check my child's CDBS balance?",
        a: `If your Medicare online account is linked to myGov, you can check the CDBS balance under History and statements → Child Dental Benefits Schedule. [Dental providers can also check](${CDBS_HOW_TO}) eligibility and available benefits.`,
      },
    ],
  },
  {
    id: 'visiting',
    title: `Visiting ${business.name}`,
    faqs: [
      {
        q: 'Are you accepting new patients?',
        a: `Yes, ${business.name} welcomes new patients. If you are looking for a new dentist, our [New Patient Comprehensive Care Visit](/new-patient-comprehensive-care-visit) is designed to give you a thorough starting point and a clear understanding of your dental health.`,
      },
      {
        q: `Where is ${business.name}?`,
        a: `${business.name} is located at ${fullAddress}, on the corner of Dandenong and Orrong Roads. See our [contact page](/contact) for directions and opening hours.`,
      },
      {
        q: 'What areas do you see patients from?',
        a: `Patients visit ${business.name} from St Kilda East and [surrounding areas](/areas-we-serve) including St Kilda, Balaclava, Ripponlea, Elwood, Elsternwick, Caulfield, Windsor, Prahran, Armadale, Malvern, South Yarra and nearby suburbs.`,
      },
      {
        q: 'Is parking available?',
        a: 'Yes. There is free off-street parking off Orrong Road. Trams 5 and 64 stop along Dandenong Road, and Balaclava Station on the Sandringham line is a short walk away.',
      },
      {
        q: 'Can I book online?',
        a: 'Yes. Patients can book through the [online booking system](/online-booking) or contact the practice directly if they would prefer to speak with the team.',
      },
      {
        q: 'Should I book an emergency appointment or a normal appointment?',
        a: 'If you have significant pain, swelling, dental trauma, a broken tooth or another urgent problem, contact the clinic and explain your symptoms. The team can help determine which appointment type is most appropriate. Our [emergency dentist](/emergency-dentist) page has first-aid steps for common problems.',
      },
    ],
  },
]

/** A stable anchor id from a question: "What is a dental implant?" → "what-is-a-dental-implant". */
export const faqId = (q: string) =>
  q
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** The answer as plain text, links reduced to their words — for the schema. */
export const faqPlainText = (a: string) =>
  a.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\n{2,}/g, ' ')
