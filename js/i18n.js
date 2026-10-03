/* =========================================================
   i18n.js — English / Nepali language switching
   Every translatable key used across the site lives here.
   ========================================================= */

const TRANSLATIONS = {

  /* =======================================================
     ENGLISH
     ======================================================= */
  en: {
    /* meta & brand */
    'meta.title': 'Gyan Niketan English Secondary School | Badan Nagar, Parsa-32',
    'brand.sub': 'English Secondary School',

    /* navigation */
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.team': 'Our Team',
    'nav.academics': 'Academics',
    'nav.admissions': 'Admissions',
    'nav.gallery': 'Gallery',
    'nav.notices': 'Notices',
    'nav.contact': 'Contact',

    /* calls to action */
    'cta.apply': 'Apply for Admission',
    'cta.tour': 'Virtual Tour / Gallery',
    'cta.contact': 'Contact Us',
    'top.address': 'Badan Nagar, Parsa-32, Nepal',

    /* home — hero */
    'hero.badge': 'Admissions Open • Nursery – Class 10',
    'hero.title': 'Shaping Confident Learners for a Brighter Nepal',
    'hero.sub': 'English-medium education rooted in discipline, curiosity and community — in the heart of Badan Nagar, Parsa-32.',
    'hero.p1': 'NEB-aligned curriculum',
    'hero.p2': 'Experienced, caring teachers',
    'hero.p3': 'Safe, disciplined campus',

    /* home — stats */
    'stats.success': 'SEE Success Rate',
    'stats.students': 'Students Enrolled',
    'stats.faculty': 'Dedicated Faculty',
    'stats.labs': 'Modern Labs & Facilities',

    /* home — principal */
    'principal.tag': "From the Principal's Desk",
    'principal.title': 'A Warm Welcome to Gyan Niketan',
    'principal.p1': 'For over two decades, Gyan Niketan has been a second home to the children of Badan Nagar and surrounding villages. We believe every child carries a unique spark — our role is to nurture it with knowledge, discipline and kindness.',
    'principal.p2': 'Our English-medium curriculum is delivered by teachers who know each student by name. Beyond the classroom, our science labs, computer suites, sports grounds and cultural clubs help students grow into confident, responsible citizens.',
    'principal.name': 'Mrs. Bimala Singh',
    'principal.role': 'Principal & Co-founder',
    'principal.qual': "Master's in Education — Tribhuvan University",
    'principal.exp':  '20+ years in education',
    'principal.readmore': 'Read our full story',

    /* home — notices preview */
    'notices.tag': 'Notice Board',
    'notices.title': 'Latest News & Announcements',
    'notices.viewall': 'View All Notices',
    'notices.loading': 'Loading notices…',
    'notices.readmore': 'Read more',

    /* home — features */
    'features.tag': 'Why Gyan Niketan',
    'features.title': 'Everything Your Child Needs to Thrive',
    'features.sub': 'A complete learning environment — academics, activities and care.',
    'features.f1.t': 'English Medium Curriculum',
    'features.f1.d': 'NEB-aligned syllabus taught entirely in English, with strong foundations in Maths, Science and language.',
    'features.f2.t': 'Science & Computer Labs',
    'features.f2.d': 'Fully equipped physics, chemistry, biology and computer labs for hands-on practical learning.',
    'features.f3.t': 'Sports & Extracurriculars',
    'features.f3.d': 'Football, volleyball, athletics, music, dance and debate — because growth happens outside books too.',
    'features.f4.t': 'Transportation / Bus Service',
    'features.f4.d': 'Safe, supervised school bus routes covering Badan Nagar, Jeetpur and nearby areas.',
    'features.f5.t': 'Safe & Disciplined Environment',
    'features.f5.d': 'CCTV-monitored campus, trained staff and a clear code of conduct that keeps every child secure.',
    'features.f6.t': 'Small, Caring Class Sizes',
    'features.f6.d': 'Limited students per class so every learner receives personal attention and steady feedback.',

    /* home — testimonials */
    'testi.tag': 'Parent Voices',
    'testi.title': 'Trusted by Families Across Parsa',
    'testi.t1.q': '"My daughter joined in Nursery and is now in Class 8. The teachers here genuinely care — they call us if she misses even one day. That trust is priceless."',
    'testi.t1.n': 'Sunita Devi Yadav',
    'testi.t1.r': 'Parent, Class 8',
    'testi.t2.q': '"The science labs and computer classes gave my son confidence I never had at his age. He now wants to become an engineer."',
    'testi.t2.n': 'Rajesh Kumar Sah',
    'testi.t2.r': 'Parent, Class 10',
    'testi.t3.q': '"Discipline, cleanliness and regular notices — as a working mother, I always know what is happening at school."',
    'testi.t3.n': 'Anita Chaudhary',
    'testi.t3.r': 'Parent, Class 5',

    /* home — CTA band */
    'band.title': 'Ready to Join the Gyan Niketan Family?',
    'band.sub': 'Admissions for the new academic session are now open. Apply online in under two minutes.',
    'band.call': 'Call +977-9800000000',

    /* shared — page breadcrumb home */
    'page.home': 'Home',

    /* About page */
    'about.hero.tag': 'About Us',
    'about.hero.title': 'A School Built on Trust, Discipline and Care',
    'about.hero.sub': 'Serving families across Badan Nagar, Jeetpur and greater Parsa since 2003.',
    'about.history.tag': 'Our Story',
    'about.history.title': 'Two Decades of Nurturing Young Minds',
    'about.history.p1': 'Gyan Niketan English Secondary School was founded in 2003 with a simple idea: that children from Badan Nagar and surrounding villages deserve an English-medium education as strong as any in the cities — without leaving their community.',
    'about.history.p2': 'What started with two rented rooms and 42 students is today a full Nursery-to-Class-10 school with modern science and computer labs, a library, sports facilities and a dedicated team of over 45 teachers and staff.',
    'about.history.p3': 'Our alumni are now doctors, engineers, teachers and entrepreneurs. But our proudest measure remains the trust that thousands of parents have placed in us, year after year.',
    'about.vision.tag': 'Vision',
    'about.vision.title': 'Our Vision',
    'about.vision.text': 'To be the most trusted English-medium school in the Parsa region — where every child is known by name, challenged to think, and guided to become a responsible, compassionate citizen.',
    'about.mission.tag': 'Mission',
    'about.mission.title': 'Our Mission',
    'about.mission.text': 'To deliver a rigorous, NEB-aligned curriculum in a safe and disciplined environment; to celebrate every child\u2019s strengths; and to partner closely with parents at every step of their child\u2019s journey.',
    'about.values.tag': 'Core Values',
    'about.values.title': 'What We Stand For',
    'about.values.v1.t': 'Discipline',    'about.values.v1.d': 'Punctuality, respect and consistency in everything we do.',
    'about.values.v2.t': 'Curiosity',     'about.values.v2.d': 'We encourage questions, experiments and independent thinking.',
    'about.values.v3.t': 'Compassion',    'about.values.v3.d': 'Kindness toward classmates, teachers and community.',
    'about.values.v4.t': 'Excellence',    'about.values.v4.d': 'We aim high and support every learner to reach their best.',
    'about.values.v5.t': 'Integrity',     'about.values.v5.d': 'Honesty and fairness in academics and daily life.',
    'about.values.v6.t': 'Community',     'about.values.v6.d': 'We grow together — students, parents, teachers and neighbours.',

    /* Our Team page */
    'team.hero.tag': 'Our Team',
    'team.hero.title': 'The People Behind Gyan Niketan',
    'team.hero.sub': 'Teachers, staff and leaders who know every student by name — and who show up for them every single day.',
    'team.member.3.name': 'Ajit Kumar Kushwaha',     'team.member.3.role': 'Accountant',
    'team.member.3.qual': 'BBS in Accounting — Tribhuvan University',
    'team.member.3.exp':  '10+ years at Gyan Niketan',
    'team.member.4.name': 'Sanjay Kumar Chaudhary',  'team.member.4.role': 'School-Incharge',
    'team.member.4.qual': 'M.Ed. in Educational Leadership',
    'team.member.4.exp':  '12+ years of experience',
    'team.member.5.name': 'Kishan Gautam',           'team.member.5.role': 'Managing Director',
    'team.member.5.qual': 'MBA — Kathmandu University',
    'team.member.5.exp':  '15+ years in school administration',
    'team.member.6.name': 'Nagendra Kumar Singh',    'team.member.6.role': 'Director & Founder',
    'team.member.6.qual': 'M.A. in English Literature',
    'team.member.6.exp':  'Founding member since 2003',

    /* Leader's Voice (Vice-Principal's message) */
    'vp.tag':         "From the Vice-Principal's Desk",
    'vp.title':       'Learning with Purpose, Growing with Values',
    'vp.name':        'Umesh Prasad Chaudhary',
    'vp.role':        'Vice-Principal',
    'vp.qual.degree': 'Masters in Mathematics — Tribhuvan University',
    'vp.qual.since':  'Serving Gyan Niketan since 2063 BS',
    'vp.p1':          'A strong school is built on three pillars — dedicated teachers, supportive parents and disciplined students. My role is to ensure all three work together, every single day, so that every child at Gyan Niketan has the best possible chance to succeed.',
    'vp.p2':          'From the classroom to the playground, we are committed to giving our students an environment where they can ask questions freely, learn from their mistakes, and grow into confident, capable young adults. Our teachers do not just teach the syllabus — they mentor, guide and inspire.',
    'vp.p3':          'To our parents: thank you for trusting us with your child\u2019s future. To our students: bring your curiosity, work hard, and remember that character matters as much as marks.',
    'vp.contact':     'Get in touch with us',

    /* Academics page */
    'acad.hero.tag': 'Academics',
    'acad.hero.title': 'A Curriculum That Builds Strong Foundations',
    'acad.hero.sub': 'NEB-aligned, English-medium, and enriched with practical learning.',
    'acad.grades.tag': 'Grades Offered',
    'acad.grades.title': 'Nursery to Class 10',
    'acad.grades.sub': 'Every stage is designed around the developmental needs of the child.',
    'acad.grades.g1.t': 'Pre-Primary (Nursery – UKG)',
    'acad.grades.g1.d': 'Play-based learning, phonics, storytelling, rhymes and early numeracy in a warm, safe space.',
    'acad.grades.g2.t': 'Primary (Classes 1 – 5)',
    'acad.grades.g2.d': 'Strong foundation in English, Nepali, Maths, Science, Social Studies and Computer.',
    'acad.grades.g3.t': 'Lower Secondary (Classes 6 – 8)',
    'acad.grades.g3.d': 'Subject specialisation begins, with lab work, projects and regular assessments.',
    'acad.grades.g4.t': 'Secondary (Classes 9 – 10)',
    'acad.grades.g4.d': 'NEB-aligned curriculum preparing students for the SEE examination and beyond.',
    'acad.curriculum.tag': 'Curriculum & Examinations',
    'acad.curriculum.title': 'How We Teach & Assess',
    'acad.curriculum.p': 'Our syllabus follows the National Curriculum Development Centre (CDC) framework and prepares students for the Secondary Education Examination (SEE). English is the medium of instruction for all subjects except Nepali.',
    'acad.curriculum.li1': 'Terminal exams twice a year (First & Second Terminal)',
    'acad.curriculum.li2': 'Monthly unit tests and continuous classroom assessment',
    'acad.curriculum.li3': 'Practical examinations for Science and Computer',
    'acad.curriculum.li4': 'Project work and presentations from Class 4 upward',
    'acad.curriculum.li5': 'Pre-board exams for Class 10 before SEE',
    'acad.clubs.tag': 'Beyond the Classroom',
    'acad.clubs.title': 'Clubs & Extracurricular Activities',
    'acad.clubs.c1.t': 'Science Club',    'acad.clubs.c1.d': 'Experiments, exhibitions and science fairs throughout the year.',
    'acad.clubs.c2.t': 'Sports Club',     'acad.clubs.c2.d': 'Football, volleyball, athletics and inter-house tournaments.',
    'acad.clubs.c3.t': 'Cultural Club',   'acad.clubs.c3.d': 'Music, dance, drama and celebration of Nepali festivals and traditions.',
    'acad.clubs.c4.t': 'Computer Club',   'acad.clubs.c4.d': 'Coding basics, digital literacy and IT projects.',
    'acad.clubs.c5.t': 'Debate & Quiz',   'acad.clubs.c5.d': 'Public speaking, debate and inter-school quiz competitions.',
    'acad.clubs.c6.t': 'Eco Club',        'acad.clubs.c6.d': 'Tree planting, cleanliness drives and environmental awareness.',

    /* Admissions page */
    'admis.hero.tag': 'Admissions',
    'admis.hero.title': 'Join the Gyan Niketan Family',
    'admis.hero.sub': 'Admissions for the 2082/83 academic session are now open.',
    'admis.criteria.tag': 'Criteria',
    'admis.criteria.title': 'Admission Criteria & Age Requirements',
    'admis.criteria.p': 'Admission is open to all children regardless of caste, religion or background. A simple interaction with the child and parents is conducted before enrolment.',
    'admis.criteria.th1': 'Grade',
    'admis.criteria.th2': 'Minimum Age',
    'admis.criteria.th3': 'Required Documents',
    'admis.criteria.r1.g': 'Nursery',      'admis.criteria.r1.a': '3 years',     'admis.criteria.r1.d': 'Birth certificate, 2 photos',
    'admis.criteria.r2.g': 'LKG / UKG',    'admis.criteria.r2.a': '4 – 5 years', 'admis.criteria.r2.d': 'Birth certificate, report card',
    'admis.criteria.r3.g': 'Class 1 – 5',  'admis.criteria.r3.a': '6 – 10 years','admis.criteria.r3.d': 'Birth certificate, transfer certificate',
    'admis.criteria.r4.g': 'Class 6 – 8',  'admis.criteria.r4.a': '11 – 13 years','admis.criteria.r4.d': 'Transfer certificate, previous report card',
    'admis.criteria.r5.g': 'Class 9 – 10', 'admis.criteria.r5.a': '14 – 15 years','admis.criteria.r5.d': 'Transfer certificate, SEE registration (if applicable)',
    'admis.form.tag': 'Apply Online',
    'admis.form.title': 'Admission Enquiry Form',
    'admis.form.sub': 'Fill in the form below and our admissions team will contact you within 2 working days.',
    'admis.form.name': 'Parent / Guardian Name',
    'admis.form.phone': 'Phone Number',
    'admis.form.email': 'Email Address',
    'admis.form.grade': 'Grade Interested In',
    'admis.form.grade.select': 'Select a grade…',
    'admis.form.student': "Student's Full Name",
    'admis.form.message': 'Message (optional)',
    'admis.form.submit': 'Submit Enquiry',
    'admis.form.success': 'Thank you! Your enquiry has been received. We will contact you soon.',
    'admis.fees.tag': 'Fee Structure',
    'admis.fees.title': 'Fees & Scholarships',
    'admis.fees.p': 'Our fee structure is transparent and reviewed annually. Please contact the school office for the current year\'s detailed fee schedule and to discuss any financial assistance.',
    'admis.fees.li1': 'Admission and monthly fees vary by grade level.',
    'admis.fees.li2': 'Sibling discounts available for two or more children from the same family.',
    'admis.fees.li3': 'Merit scholarships for academically outstanding students of Classes 8–10.',
    'admis.fees.li4': 'Support for children from economically disadvantaged families.',
    'admis.download': 'Download Prospectus (PDF)',
    'admis.steps.tag': 'How to Apply',
    'admis.steps.title': 'Four Simple Steps',
    'admis.steps.s1.t': 'Submit Enquiry', 'admis.steps.s1.d': 'Fill the online form or visit the school office.',
    'admis.steps.s2.t': 'Interaction',    'admis.steps.s2.d': 'A short, friendly meeting with the child and parents.',
    'admis.steps.s3.t': 'Document Check', 'admis.steps.s3.d': 'Submit the required documents listed above.',
    'admis.steps.s4.t': 'Confirm Seat',   'admis.steps.s4.d': 'Pay the admission fee and receive the class schedule.',

    /* Gallery page */
    'gal.hero.tag': 'Media & Gallery',
    'gal.hero.title': 'Life at Gyan Niketan',
    'gal.hero.sub': 'Moments from our classrooms, labs, sports grounds and celebrations.',
    'gal.filter.all': 'All',
    'gal.filter.school': 'School',
    'gal.filter.classroom': 'Classrooms',
    'gal.filter.lab': 'Labs',
    'gal.filter.sports': 'Sports',
    'gal.filter.event': 'Events',
    'gal.empty': 'No photos in this category yet.',

    /* Notices page */
    'noti.hero.tag': 'Notice Board',
    'noti.hero.title': 'Notices, News & Announcements',
    'noti.hero.sub': 'Official updates from the school office — searchable and categorised.',
    'noti.filter.all': 'All',
    'noti.filter.exam': 'Exams',
    'noti.filter.holiday': 'Holidays',
    'noti.filter.event': 'Events',
    'noti.filter.general': 'General',
    'noti.search': 'Search notices…',
    'noti.empty': 'No notices match your search.',
    'noti.cat.exam': 'Examination',
    'noti.cat.holiday': 'Holiday',
    'noti.cat.event': 'Event',
    'noti.cat.general': 'General',

    /* Notice letterhead modal */
    'notice.print': 'Print',
    'notice.close': 'Close',
    'notice.schedule': 'Schedule',
    'notice.no.schedule': 'No schedule attached yet.',

    /* Contact page */
    'cont.hero.tag': 'Contact Us',
    'cont.hero.title': 'We Would Love to Hear From You',
    'cont.hero.sub': 'Visit, call or send us a message — we usually reply within one working day.',
    'cont.info.title': 'Reach Us',
    'cont.info.address': 'Badan Nagar, Parsa-32, Madhesh Province, Nepal',
    'cont.info.phone': '+977-9800000000',
    'cont.info.email': 'info@gyanniketan.edu.np',
    'cont.info.hours': 'Sunday – Friday: 7:00 AM – 4:00 PM',
    'cont.info.fb': 'Follow us on Facebook',
    'cont.card.address': 'Address',
    'cont.card.phone': 'Phone',
    'cont.card.email': 'Email',
    'cont.card.hours': 'Hours',
    'cont.card.fb': 'Facebook',
    'cont.form.title': 'Send Us a Message',
    'cont.form.name': 'Your Name',
    'cont.form.phone': 'Phone Number',
    'cont.form.email': 'Email Address',
    'cont.form.grade': 'Grade Interested In',
    'cont.form.message': 'Your Message',
    'cont.form.submit': 'Send Message',
    'cont.form.success': 'Thank you! Your message has been sent. We will be in touch soon.',
    'cont.map.title': 'Find Us on the Map',

    /* Footer */
    'footer.about': 'An English-medium secondary school in Badan Nagar, Parsa-32, dedicated to academic excellence, discipline and holistic growth.',
    'footer.quicklinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.address': 'Badan Nagar, Parsa-32, Madhesh Province, Nepal',
    'footer.hours': 'Sun–Fri: 7:00 AM – 4:00 PM',
    'footer.findus': 'Find Us',
    'footer.rights': 'All rights reserved.',
    'footer.notices': 'Notice Board'
  },

  /* =======================================================
     NEPALI
     ======================================================= */
  np: {
    'meta.title': 'ज्ञान निकेतन इङ्लिश माध्यमिक विद्यालय | बदन नगर, पर्सा-३२',
    'brand.sub': 'इङ्लिश माध्यमिक विद्यालय',

    'nav.home': 'गृहपृष्ठ',
    'nav.about': 'हाम्रोबारे',
    'nav.team': 'हाम्रो टोली',
    'nav.academics': 'शैक्षिक',
    'nav.admissions': 'भर्ना',
    'nav.gallery': 'ग्यालरी',
    'nav.notices': 'सूचना',
    'nav.contact': 'सम्पर्क',

    'cta.apply': 'भर्नाको लागि आवेदन',
    'cta.tour': 'भर्चुअल भ्रमण / ग्यालरी',
    'cta.contact': 'सम्पर्क गर्नुहोस्',
    'top.address': 'बदन नगर, पर्सा-३२, नेपाल',

    'hero.badge': 'भर्ना खुला • नर्सरी – कक्षा १०',
    'hero.title': 'उज्ज्वल नेपालका लागि आत्मविश्वासी विद्यार्थी निर्माण',
    'hero.sub': 'बदन नगर, पर्सा-३२ को हृदयमा अनुशासन, जिज्ञासा र समुदायमा आधारित अङ्ग्रेजी माध्यम शिक्षा।',
    'hero.p1': 'NEB अनुरूप पाठ्यक्रम',
    'hero.p2': 'अनुभवी र मायालु शिक्षक',
    'hero.p3': 'सुरक्षित र अनुशासित क्याम्पस',

    'stats.success': 'SEE उत्तीर्ण दर',
    'stats.students': 'भर्ना भएका विद्यार्थी',
    'stats.faculty': 'समर्पित शिक्षक',
    'stats.labs': 'आधुनिक प्रयोगशाला',

    'principal.tag': 'प्रधानाध्यापकको कुरा',
    'principal.title': 'ज्ञान निकेतनमा हार्दिक स्वागत',
    'principal.p1': 'दुई दशकभन्दा बढी समयदेखि ज्ञान निकेतन बदन नगर र वरपरका गाउँका बालबालिकाको दोस्रो घर बनेको छ। हामी विश्वास गर्छौं प्रत्येक बालबालिकामा एउटा अनौठो चमक हुन्छ — हाम्रो भूमिका ज्ञान, अनुशासन र दयाले त्यसलाई हुर्काउनु हो।',
    'principal.p2': 'हाम्रो अङ्ग्रेजी माध्यम पाठ्यक्रम प्रत्येक विद्यार्थीलाई नामैले चिन्ने शिक्षकहरूद्वारा पढाइन्छ। कक्षाकोठा बाहिर, हाम्रा विज्ञान प्रयोगशाला, कम्प्युटर कक्ष, खेल मैदान र सांस्कृतिक क्लबहरूले विद्यार्थीलाई आत्मविश्वासी, जिम्मेवार नागरिक बनाउन मद्दत गर्छन्।',
    'principal.name': 'श्रीमती बिमला सिंह',
    'principal.role': 'प्रधानाध्यापक एवं सह-संस्थापक',
    'principal.qual': 'शिक्षामा स्नातकोत्तर — त्रिभुवन विश्वविद्यालय',
    'principal.exp':  'शिक्षणमा २०+ वर्षको अनुभव',
    'principal.readmore': 'हाम्रो पूरा कथा पढ्नुहोस्',

    'notices.tag': 'सूचना पाटी',
    'notices.title': 'पछिल्ला समाचार र घोषणाहरू',
    'notices.viewall': 'सबै सूचना हेर्नुहोस्',
    'notices.loading': 'सूचना लोड हुँदै…',
    'notices.readmore': 'थप पढ्नुहोस्',

    'features.tag': 'किन ज्ञान निकेतन',
    'features.title': 'तपाईंको बच्चालाई फस्टाउन आवश्यक सबै कुरा',
    'features.sub': 'पूर्ण सिकाइ वातावरण — शिक्षा, गतिविधि र हेरचाह।',
    'features.f1.t': 'अङ्ग्रेजी माध्यम पाठ्यक्रम',
    'features.f1.d': 'पूर्ण रूपमा अङ्ग्रेजीमा पढाइने NEB अनुरूप पाठ्यक्रम, गणित, विज्ञान र भाषामा बलियो जग।',
    'features.f2.t': 'विज्ञान र कम्प्युटर प्रयोगशाला',
    'features.f2.d': 'भौतिक, रसायन, जीवविज्ञान र कम्प्युटर प्रयोगशालामा व्यावहारिक सिकाइ।',
    'features.f3.t': 'खेलकुद र अतिरिक्त गतिविधि',
    'features.f3.d': 'फुटबल, भलिबल, एथलेटिक्स, संगीत, नृत्य र वादविवाद — किताब बाहिर पनि विकास हुन्छ।',
    'features.f4.t': 'यातायात / बस सेवा',
    'features.f4.d': 'बदन नगर, जीतपुर र आसपासका क्षेत्रमा सुरक्षित, निगरानी सहितको बस सेवा।',
    'features.f5.t': 'सुरक्षित र अनुशासित वातावरण',
    'features.f5.d': 'CCTV निगरानी, प्रशिक्षित कर्मचारी र स्पष्ट आचरण संहिताले प्रत्येक बच्चालाई सुरक्षित राख्छ।',
    'features.f6.t': 'सानो र मायालु कक्षा',
    'features.f6.d': 'प्रत्येक कक्षामा सीमित विद्यार्थी, जसले व्यक्तिगत ध्यान र निरन्तर प्रतिक्रिया सुनिश्चित गर्छ।',

    'testi.tag': 'अभिभावकको आवाज',
    'testi.title': 'पर्साभरका परिवारहरूको विश्वास',
    'testi.t1.q': '"मेरी छोरी नर्सरीमा भर्ना भई अहिले कक्षा ८ मा पुगेकी छिन्। यहाँका शिक्षकहरू साँच्चै माया गर्छन् — एक दिन नआए पनि फोन गर्छन्। त्यो विश्वास अमूल्य छ।"',
    'testi.t1.n': 'सुनिता देवी यादव',
    'testi.t1.r': 'अभिभावक, कक्षा ८',
    'testi.t2.q': '"विज्ञान प्रयोगशाला र कम्प्युटर कक्षाले मेरो छोरालाई मेरो उमेरमा नभएको आत्मविश्वास दियो। अहिले उनी इन्जिनियर बन्न चाहन्छन्।"',
    'testi.t2.n': 'राजेश कुमार साह',
    'testi.t2.r': 'अभिभावक, कक्षा १०',
    'testi.t3.q': '"अनुशासन, सरसफाई र नियमित सूचना — कामकाजी आमाको रूपमा मलाई सधैं थाहा हुन्छ विद्यालयमा के भइरहेको छ।"',
    'testi.t3.n': 'अनिता चौधरी',
    'testi.t3.r': 'अभिभावक, कक्षा ५',

    'band.title': 'ज्ञान निकेतन परिवारमा सामेल हुन तयार?',
    'band.sub': 'नयाँ शैक्षिक सत्रको भर्ना खुला छ। दुई मिनेटमै अनलाइन आवेदन गर्नुहोस्।',
    'band.call': 'फोन गर्नुहोस् +९७७-९८००००००००',

    'page.home': 'गृहपृष्ठ',

    'about.hero.tag': 'हाम्रोबारे',
    'about.hero.title': 'विश्वास, अनुशासन र मायामा आधारित विद्यालय',
    'about.hero.sub': '२००३ देखि बदन नगर, जीतपुर र पर्साभरका परिवारहरूको सेवामा।',
    'about.history.tag': 'हाम्रो कथा',
    'about.history.title': 'दुई दशकको युवा मनको स्याहार',
    'about.history.p1': 'ज्ञान निकेतन इङ्लिश माध्यमिक विद्यालयको स्थापना २००३ मा एउटा सरल सोचका साथ भएको थियो: बदन नगर र वरपरका गाउँका बालबालिकाले आफ्नै समुदायमा बसेर सहरकै स्तरको अङ्ग्रेजी माध्यम शिक्षा पाउनुपर्छ।',
    'about.history.p2': 'दुई भाडाका कोठा र ४२ विद्यार्थीबाट सुरु भएको यो विद्यालय आज नर्सरीदेखि कक्षा १० सम्म, आधुनिक विज्ञान र कम्प्युटर प्रयोगशाला, पुस्तकालय, खेल सुविधा र ४५ भन्दा बढी शिक्षक तथा कर्मचारीको समर्पित टोली सहितको पूर्ण विद्यालय बनेको छ।',
    'about.history.p3': 'हाम्रा पूर्व विद्यार्थीहरू अहिले डाक्टर, इन्जिनियर, शिक्षक र उद्यमी बनेका छन्। तर हाम्रो सबैभन्दा ठूलो गौरव हजारौं अभिभावकहरूको विश्वास हो।',
    'about.vision.tag': 'दृष्टिकोण',
    'about.vision.title': 'हाम्रो दृष्टिकोण',
    'about.vision.text': 'पर्सा क्षेत्रको सबैभन्दा विश्वसनीय अङ्ग्रेजी माध्यम विद्यालय बन्ने — जहाँ प्रत्येक बालबालिकालाई नामैले चिनिन्छ, सोच्न प्रेरित गरिन्छ, र जिम्मेवार, दयालु नागरिक बनाइन्छ।',
    'about.mission.tag': 'लक्ष्य',
    'about.mission.title': 'हाम्रो लक्ष्य',
    'about.mission.text': 'सुरक्षित र अनुशासित वातावरणमा कठोर, NEB अनुरूप पाठ्यक्रम प्रदान गर्ने; प्रत्येक बालबालिकाको प्रतिभालाई सम्मान गर्ने; र अभिभावकसँग मिलेर यात्रा गर्ने।',
    'about.values.tag': 'मूल मूल्यहरू',
    'about.values.title': 'हामी के मा उभिएका छौं',
    'about.values.v1.t': 'अनुशासन',  'about.values.v1.d': 'समयपालन, सम्मान र निरन्तरता।',
    'about.values.v2.t': 'जिज्ञासा',   'about.values.v2.d': 'प्रश्न, प्रयोग र स्वतन्त्र सोचलाई प्रोत्साहन।',
    'about.values.v3.t': 'करुणा',      'about.values.v3.d': 'साथी, शिक्षक र समुदायप्रति दया।',
    'about.values.v4.t': 'उत्कृष्टता', 'about.values.v4.d': 'उच्च लक्ष्य र प्रत्येकको उत्कृष्टताको समर्थन।',
    'about.values.v5.t': 'इमानदारी',  'about.values.v5.d': 'शैक्षिक र दैनिक जीवनमा सत्यता।',
    'about.values.v6.t': 'समुदाय',     'about.values.v6.d': 'विद्यार्थी, अभिभावक, शिक्षक र छिमेकी सँगै हुर्कन्छौं।',

    /* हाम्रो टोली पृष्ठ */
    'team.hero.tag': 'हाम्रो टोली',
    'team.hero.title': 'ज्ञान निकेतनका मानिसहरू',
    'team.hero.sub': 'प्रत्येक विद्यार्थीलाई नामैले चिन्ने शिक्षक, कर्मचारी र नेतृत्व — जो हरेक दिन उनीहरूका लागि उपस्थित हुन्छन्।',
    'team.member.3.name': 'अजित कुमार कुशवाहा',     'team.member.3.role': 'लेखापाल',
    'team.member.3.qual': 'वाणिज्यमा स्नातक — त्रिभुवन विश्वविद्यालय',
    'team.member.3.exp':  'ज्ञान निकेतनमा १०+ वर्ष',
    'team.member.4.name': 'सञ्जय कुमार चौधरी',       'team.member.4.role': 'विद्यालय प्रभारी',
    'team.member.4.qual': 'शैक्षिक नेतृत्वमा एम.एड.',
    'team.member.4.exp':  '१२+ वर्षको अनुभव',
    'team.member.5.name': 'किशन गौतम',              'team.member.5.role': 'प्रबन्ध निर्देशक',
    'team.member.5.qual': 'एम.बी.ए. — काठमाडौं विश्वविद्यालय',
    'team.member.5.exp':  'विद्यालय व्यवस्थापनमा १५+ वर्ष',
    'team.member.6.name': 'नागेन्द्र कुमार सिंह',    'team.member.6.role': 'निर्देशक एवं संस्थापक',
    'team.member.6.qual': 'अङ्ग्रेजी साहित्यमा एम.ए.',
    'team.member.6.exp':  '२००३ देखि संस्थापक सदस्य',

    /* नेतृत्वको आवाज (उप-प्रधानाध्यापकको सन्देश) */
    'vp.tag':         'उप-प्रधानाध्यापकको कुरा',
    'vp.title':       'उद्देश्यका साथ सिकाइ, मूल्यमान्यताका साथ विकास',
    'vp.name':        'उमेश प्रसाद चौधरी',
    'vp.role':        'उप-प्रधानाध्यापक',
    'vp.qual.degree': 'गणितमा स्नातकोत्तर — त्रिभुवन विश्वविद्यालय',
    'vp.qual.since':  '२०६३ सालदेखि ज्ञान निकेतनमा सेवारत',
    'vp.p1':          'बलियो विद्यालय तीन स्तम्भमा उभिन्छ — समर्पित शिक्षक, सहयोगी अभिभावक र अनुशासित विद्यार्थी। मेरो भूमिका यी तीनैलाई सँगै काम गराउनु हो, जसले गर्दा ज्ञान निकेतनका हरेक बालबालिकाले सफल हुने उत्तम अवसर पाउन्।',
    'vp.p2':          'कक्षाकोठादेखि खेल मैदानसम्म, हामी विद्यार्थीहरूलाई खुला रूपमा प्रश्न सोध्न, गल्तीबाट सिक्न र आत्मविश्वासी युवा बन्न सक्ने वातावरण दिन प्रतिबद्ध छौं। हाम्रा शिक्षकहरू केवल पाठ्यक्रम पढाउँदैनन् — उनीहरू मार्गदर्शन गर्छन् र प्रेरणा दिन्छन्।',
    'vp.p3':          'अभिभावकहरूलाई: तपाईंको बच्चाको भविष्यप्रति हामीलाई विश्वास गर्नुभएकोमा धन्यवाद। विद्यार्थीहरूलाई: जिज्ञासा लिएर आउनुहोस्, मिहिनेत गर्नुहोस्, र सम्झनुहोस् — चरित्र अंकभन्दा ठूलो कुरा हो।',
    'vp.contact':     'हामीलाई सम्पर्क गर्नुहोस्',

    'acad.hero.tag': 'शैक्षिक',
    'acad.hero.title': 'बलियो जग बनाउने पाठ्यक्रम',
    'acad.hero.sub': 'NEB अनुरूप, अङ्ग्रेजी माध्यम, व्यावहारिक सिकाइले समृद्ध।',
    'acad.grades.tag': 'उपलब्ध कक्षाहरू',
    'acad.grades.title': 'नर्सरीदेखि कक्षा १० सम्म',
    'acad.grades.sub': 'प्रत्येक तह बालबालिकाको विकासात्मक आवश्यकता अनुसार तयार पारिएको छ।',
    'acad.grades.g1.t': 'प्रि-प्राइमरी (नर्सरी – UKG)',
    'acad.grades.g1.d': 'खेलमा आधारित सिकाइ, फोनिक्स, कथा र प्रारम्भिक गणना।',
    'acad.grades.g2.t': 'प्राथमिक (कक्षा १ – ५)',
    'acad.grades.g2.d': 'अङ्ग्रेजी, नेपाली, गणित, विज्ञान, सामाजिक र कम्प्युटरमा बलियो जग।',
    'acad.grades.g3.t': 'निम्न माध्यमिक (कक्षा ६ – ८)',
    'acad.grades.g3.d': 'विषय विशेषज्ञता सुरु, प्रयोगशाला कार्य र परियोजना।',
    'acad.grades.g4.t': 'माध्यमिक (कक्षा ९ – १०)',
    'acad.grades.g4.d': 'SEE परीक्षाको तयारी गर्ने NEB अनुरूप पाठ्यक्रम।',
    'acad.curriculum.tag': 'पाठ्यक्रम र परीक्षा',
    'acad.curriculum.title': 'हामी कसरी पढाउँछौं र मूल्याङ्कन गर्छौं',
    'acad.curriculum.p': 'हाम्रो पाठ्यक्रम राष्ट्रिय पाठ्यक्रम विकास केन्द्र (CDC) को ढाँचा अनुसार छ र विद्यार्थीलाई माध्यमिक शिक्षा परीक्षा (SEE) को तयारी गराउँछ। नेपाली बाहेक सबै विषय अङ्ग्रेजीमा पढाइन्छ।',
    'acad.curriculum.li1': 'वर्षको दुई पटक त्रैमासिक परीक्षा',
    'acad.curriculum.li2': 'मासिक एकाइ परीक्षा र निरन्तर मूल्याङ्कन',
    'acad.curriculum.li3': 'विज्ञान र कम्प्युटरको व्यावहारिक परीक्षा',
    'acad.curriculum.li4': 'कक्षा ४ देखि परियोजना कार्य र प्रस्तुति',
    'acad.curriculum.li5': 'SEE अघि कक्षा १० को प्रि-बोर्ड परीक्षा',
    'acad.clubs.tag': 'कक्षाकोठा बाहिर',
    'acad.clubs.title': 'क्लब र अतिरिक्त गतिविधि',
    'acad.clubs.c1.t': 'विज्ञान क्लब',           'acad.clubs.c1.d': 'वर्षभर प्रयोग, प्रदर्शनी र विज्ञान मेला।',
    'acad.clubs.c2.t': 'खेलकुद क्लब',            'acad.clubs.c2.d': 'फुटबल, भलिबल, एथलेटिक्स र अन्तर-सदन प्रतियोगिता।',
    'acad.clubs.c3.t': 'सांस्कृतिक क्लब',         'acad.clubs.c3.d': 'संगीत, नृत्य, नाटक र नेपाली पर्व।',
    'acad.clubs.c4.t': 'कम्प्युटर क्लब',           'acad.clubs.c4.d': 'कोडिङ, डिजिटल साक्षरता र IT परियोजना।',
    'acad.clubs.c5.t': 'वादविवाद र क्विज',        'acad.clubs.c5.d': 'भाषण, वादविवाद र अन्तर-विद्यालय क्विज।',
    'acad.clubs.c6.t': 'वातावरण क्लब',           'acad.clubs.c6.d': 'वृक्षारोपण, सरसफाई अभियान र वातावरणीय सचेतना।',

    'admis.hero.tag': 'भर्ना',
    'admis.hero.title': 'ज्ञान निकेतन परिवारमा सामेल हुनुहोस्',
    'admis.hero.sub': 'शैक्षिक सत्र २०८२/८३ को भर्ना खुला छ।',
    'admis.criteria.tag': 'मापदण्ड',
    'admis.criteria.title': 'भर्ना मापदण्ड र उमेर',
    'admis.criteria.p': 'जात, धर्म वा पृष्ठभूमिको भेदभाव बिना सबै बालबालिकालाई भर्ना खुला छ। भर्ना अघि बच्चा र अभिभावकसँग छोटो कुराकानी गरिन्छ।',
    'admis.criteria.th1': 'कक्षा',
    'admis.criteria.th2': 'न्यूनतम उमेर',
    'admis.criteria.th3': 'आवश्यक कागजात',
    'admis.criteria.r1.g': 'नर्सरी',          'admis.criteria.r1.a': '३ वर्ष',         'admis.criteria.r1.d': 'जन्मदर्ता, २ फोटो',
    'admis.criteria.r2.g': 'LKG / UKG',      'admis.criteria.r2.a': '४ – ५ वर्ष',     'admis.criteria.r2.d': 'जन्मदर्ता, प्रगति पुस्तिका',
    'admis.criteria.r3.g': 'कक्षा १ – ५',    'admis.criteria.r3.a': '६ – १० वर्ष',    'admis.criteria.r3.d': 'जन्मदर्ता, स्थानान्तरण प्रमाणपत्र',
    'admis.criteria.r4.g': 'कक्षा ६ – ८',    'admis.criteria.r4.a': '११ – १३ वर्ष',   'admis.criteria.r4.d': 'स्थानान्तरण प्रमाणपत्र, प्रगति पुस्तिका',
    'admis.criteria.r5.g': 'कक्षा ९ – १०',   'admis.criteria.r5.a': '१४ – १५ वर्ष',   'admis.criteria.r5.d': 'स्थानान्तरण प्रमाणपत्र, SEE दर्ता (लागू भएमा)',
    'admis.form.tag': 'अनलाइन आवेदन',
    'admis.form.title': 'भर्ना जिज्ञासा फारम',
    'admis.form.sub': 'तलको फारम भर्नुहोस्, हाम्रो टोलीले २ कार्यदिनभित्र सम्पर्क गर्नेछ।',
    'admis.form.name': 'अभिभावकको नाम',
    'admis.form.phone': 'फोन नम्बर',
    'admis.form.email': 'इमेल ठेगाना',
    'admis.form.grade': 'इच्छुक कक्षा',
    'admis.form.grade.select': 'कक्षा छान्नुहोस्…',
    'admis.form.student': 'विद्यार्थीको पूरा नाम',
    'admis.form.message': 'सन्देश (वैकल्पिक)',
    'admis.form.submit': 'जिज्ञासा पठाउनुहोस्',
    'admis.form.success': 'धन्यवाद! तपाईंको जिज्ञासा प्राप्त भयो। हामी चाँडै सम्पर्क गर्नेछौं।',
    'admis.fees.tag': 'शुल्क संरचना',
    'admis.fees.title': 'शुल्क र छात्रवृत्ति',
    'admis.fees.p': 'हाम्रो शुल्क संरचना पारदर्शी छ र वार्षिक रूपमा पुनरावलोकन गरिन्छ। चालु वर्षको विस्तृत शुल्क तालिकाका लागि विद्यालय कार्यालयमा सम्पर्क गर्नुहोस्।',
    'admis.fees.li1': 'भर्ना र मासिक शुल्क कक्षा अनुसार फरक पर्छ।',
    'admis.fees.li2': 'एउटै परिवारका दुई वा बढी बालबालिकालाई छुट।',
    'admis.fees.li3': 'कक्षा ८–१० का उत्कृष्ट विद्यार्थीलाई मेरिट छात्रवृत्ति।',
    'admis.fees.li4': 'आर्थिक रूपमा कमजोर परिवारका बालबालिकालाई सहयोग।',
    'admis.download': 'विवरण पुस्तिका डाउनलोड गर्नुहोस् (PDF)',
    'admis.steps.tag': 'कसरी आवेदन गर्ने',
    'admis.steps.title': 'चार सरल चरणहरू',
    'admis.steps.s1.t': 'जिज्ञासा पठाउनुहोस्',  'admis.steps.s1.d': 'अनलाइन फारम भर्नुहोस् वा विद्यालयमा आउनुहोस्।',
    'admis.steps.s2.t': 'कुराकानी',             'admis.steps.s2.d': 'बच्चा र अभिभावकसँग छोटो भेटघाट।',
    'admis.steps.s3.t': 'कागजात जाँच',          'admis.steps.s3.d': 'माथि उल्लेखित कागजात बुझाउनुहोस्।',
    'admis.steps.s4.t': 'सिट पुष्टि',            'admis.steps.s4.d': 'भर्ना शुल्क तिर्नुहोस् र तालिका लिनुहोस्।',

    'gal.hero.tag': 'मिडिया र ग्यालरी',
    'gal.hero.title': 'ज्ञान निकेतनको जीवन',
    'gal.hero.sub': 'कक्षाकोठा, प्रयोगशाला, खेल मैदान र उत्सवका क्षणहरू।',
    'gal.filter.all': 'सबै',
    'gal.filter.school': 'विद्यालय',
    'gal.filter.classroom': 'कक्षाकोठा',
    'gal.filter.lab': 'प्रयोगशाला',
    'gal.filter.sports': 'खेलकुद',
    'gal.filter.event': 'कार्यक्रम',
    'gal.empty': 'यो श्रेणीमा अहिले कुनै फोटो छैन।',

    'noti.hero.tag': 'सूचना पाटी',
    'noti.hero.title': 'सूचना, समाचार र घोषणाहरू',
    'noti.hero.sub': 'विद्यालय कार्यालयका आधिकारिक अपडेटहरू — खोज्न मिल्ने र वर्गीकृत।',
    'noti.filter.all': 'सबै',
    'noti.filter.exam': 'परीक्षा',
    'noti.filter.holiday': 'बिदा',
    'noti.filter.event': 'कार्यक्रम',
    'noti.filter.general': 'सामान्य',
    'noti.search': 'सूचना खोज्नुहोस्…',
    'noti.empty': 'तपाईंको खोजसँग मिल्ने सूचना भेटिएन।',
    'noti.cat.exam': 'परीक्षा',
    'noti.cat.holiday': 'बिदा',
    'noti.cat.event': 'कार्यक्रम',
    'noti.cat.general': 'सामान्य',

    'notice.print': 'प्रिन्ट',
    'notice.close': 'बन्द',
    'notice.schedule': 'तालिका',
    'notice.no.schedule': 'अहिलेसम्म कुनै तालिका संलग्न छैन।',

    'cont.hero.tag': 'सम्पर्क',
    'cont.hero.title': 'तपाईंको कुरा सुन्न चाहन्छौं',
    'cont.hero.sub': 'आउनुहोस्, फोन गर्नुहोस् वा सन्देश पठाउनुहोस् — एक कार्यदिनभित्र जवाफ दिन्छौं।',
    'cont.info.title': 'हामीसम्म पुग्नुहोस्',
    'cont.info.address': 'बदन नगर, पर्सा-३२, मधेश प्रदेश, नेपाल',
    'cont.info.phone': '+९७७-९८००००००००',
    'cont.info.email': 'info@gyanniketan.edu.np',
    'cont.info.hours': 'आइतबार – शुक्रबार: बिहान ७:०० – साँझ ४:००',
    'cont.info.fb': 'फेसबुकमा फलो गर्नुहोस्',
    'cont.card.address': 'ठेगाना',
    'cont.card.phone': 'फोन',
    'cont.card.email': 'इमेल',
    'cont.card.hours': 'समय',
    'cont.card.fb': 'फेसबुक',
    'cont.form.title': 'हामीलाई सन्देश पठाउनुहोस्',
    'cont.form.name': 'तपाईंको नाम',
    'cont.form.phone': 'फोन नम्बर',
    'cont.form.email': 'इमेल ठेगाना',
    'cont.form.grade': 'इच्छुक कक्षा',
    'cont.form.message': 'तपाईंको सन्देश',
    'cont.form.submit': 'सन्देश पठाउनुहोस्',
    'cont.form.success': 'धन्यवाद! तपाईंको सन्देश पठाइयो। हामी चाँडै सम्पर्क गर्नेछौं।',
    'cont.map.title': 'नक्सामा हामीलाई भेट्नुहोस्',

    'footer.about': 'बदन नगर, पर्सा-३२ मा रहेको अङ्ग्रेजी माध्यम माध्यमिक विद्यालय, शैक्षिक उत्कृष्टता, अनुशासन र समग्र विकासमा समर्पित।',
    'footer.quicklinks': 'द्रुत लिङ्कहरू',
    'footer.contact': 'सम्पर्क',
    'footer.address': 'बदन नगर, पर्सा-३२, मधेश प्रदेश, नेपाल',
    'footer.hours': 'आइत–शुक्र: बिहान ७:०० – साँझ ४:००',
    'footer.findus': 'हामीलाई भेट्नुहोस्',
    'footer.rights': 'सर्वाधिकार सुरक्षित।',
    'footer.notices': 'सूचना पाटी'
  }
};

/* =========================================================
   Language runtime
   ========================================================= */
let currentLang = (typeof localStorage !== 'undefined' && localStorage.getItem('gn-lang')) || 'en';

function t(key) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || key;
}

function applyLanguage(lang) {
  if (!TRANSLATIONS[lang]) lang = 'en';
  currentLang = lang;
  try { localStorage.setItem('gn-lang', lang); } catch (e) {}

  document.documentElement.lang = (lang === 'np') ? 'ne' : 'en';
  document.documentElement.setAttribute('data-lang', lang);

  // Translate every element with data-i18n="key"
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    const val = t(el.getAttribute('data-i18n'));
    if (val) el.textContent = val;
  });

  // Translate every element with data-i18n-attr="attr:key[,attr:key...]"
  // Example: <input data-i18n-attr="placeholder:noti.search">
  document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
    el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
      const parts = pair.split(':');
      if (parts.length === 2) {
        const attr = parts[0].trim();
        const key  = parts[1].trim();
        const val  = t(key);
        if (attr && val) el.setAttribute(attr, val);
      }
    });
  });

  // Swap the language switcher icon + label
  const label = document.getElementById('lang-label');
  const flag  = document.querySelector('.lang-toggle .lang-flag');
  const globe = document.querySelector('.lang-toggle .lang-globe');

  if (lang === 'en') {
    if (label) label.textContent = 'नेपाली';
    if (flag)  flag.hidden  = false;
    if (globe) globe.hidden = true;
  } else {
    if (label) label.textContent = 'English';
    if (flag)  flag.hidden  = true;
    if (globe) globe.hidden = false;
  }

  // Notify listeners (main.js re-renders notices, gallery, etc.)
  document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: lang } }));
}