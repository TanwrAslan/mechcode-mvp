import { Task } from '../types';

export const TASKS_DATA: Task[] = [
  {
    id: 1,
    code: "ENG-001",
    titleTR: "L-Braket Tasarımı",
    titleEN: "L-Bracket Design",
    difficulty: "Başlangıç",
    difficultyColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    skills: ["CAD", "Teknik Resim", "Katı Modelleme"],
    estimatedTime: "1-2 saat / hrs",
    descriptionTR: "Otomotiv ve genel montaj hatlarında yaygın kullanılan 500N statik yüke dayanıklı temel L-braket katı modeli.",
    descriptionEN: "Basic L-bracket solid model resistant to 500N static load used in automotive & general assembly.",
    isPremium: false,

    // SECTION A - CONTEXT
    contextTR: "L-braketler otomotivde motoru şaseye bağlar, beyaz eşyada iç montajda ve endüstriyel raf sistemlerinde sıkça kullanılır. Parçayı hafifletmek son derece önemlidir çünkü araç toplam ağırlığı doğrudan yakıt tüketimini ve karbon salınımını etkiler. Mühendis olarak göreviniz minimum kütlede maksimum rijitliği yakalamaktır.",
    contextEN: "L-brackets connect the engine to the chassis in automotive, and are used in appliance assembly and industrial shelving. Lightweighting is critical because total vehicle weight directly impacts fuel consumption. As an engineer, your job is to achieve maximum rigidity with minimal mass.",

    // SECTION B - BRIEF
    briefScenarioTR: "Bir raf ve ekipman ünitesini dikey duvara tutturacak L-braket tasarlayacaksınız. Parça 500N dikey statik yükü emniyetle taşımalı, 4 montaj deliğine sahip olmalı ve gereksiz kütleden kaçınılmalıdır.",
    briefScenarioEN: "You will design an L-bracket to mount an equipment shelf to a wall. The part must safely withstand 500N vertical static load, feature 4 mounting holes, and avoid unnecessary mass.",
    constraintsTR: [
      "Malzeme: Alüminyum 6061-T6 (E = 68.9 GPa, Sy = 276 MPa)",
      "Statik Yük: Dikey 500 N (Emniyet Katsayısı n ≥ 2.0)",
      "Delik Tipi: 4 × Ø10 mm montaj delikleri (Kenardan d ≥ 15mm)",
      "Kavis / Fillet: İç dik köşede R8 mm stres yumuşatma radayüsü",
      "Maksimum Boyut: 80mm × 80mm, Genişlik: 60mm, Et Kalınlığı: 8mm"
    ],
    constraintsEN: [
      "Material: Aluminum 6061-T6 (E = 68.9 GPa, Sy = 276 MPa)",
      "Static Load: Vertical 500 N (Safety Factor n ≥ 2.0)",
      "Holes: 4 × Ø10 mm mounting clearance holes (Edge dist d ≥ 15mm)",
      "Fillet: R8 mm stress relief radius on inner corner",
      "Max Dimensions: 80mm × 80mm, Width: 60mm, Wall Thickness: 8mm"
    ],
    deliverablesTR: ["3B Katı Model (.STEP / .SLDPRT / .F3D)", "Teknik Resim Paftası (.PDF)"],
    deliverablesEN: ["3D Solid Model (.STEP / .SLDPRT / .F3D)", "2D Technical Drawing Sheet (.PDF)"],

    // SECTION C - DRAWING SPECS
    drawingTitle: "DWG-ENG-001: L-BRAKET MONTAJ DETAYI",
    keyDimensions: [
      { label: "Yükseklik / Height", val: "80 mm" },
      { label: "Uzunluk / Length", val: "80 mm" },
      { label: "Genişlik / Width", val: "60 mm" },
      { label: "Et Kalınlığı / Thickness", val: "8.0 mm" },
      { label: "İç Radayüs / Inner Fillet", val: "R8.0 mm" },
      { label: "Montaj Delikleri / Holes", val: "4× Ø10.0 mm" },
      { label: "Kenar Ofseti / Edge Distance", val: "15.0 mm" }
    ],
    drawingSvgType: 'l-bracket',

    // SECTION D - STEPS
    stepsTR: [
      "Front Plane (Ön Düzlem) üzerinde 80mm × 80mm L taslağını (sketch) çizin ve et kalınlığını 8mm belirleyin.",
      "Taslağı 60mm mesafede kör (Mid Plane veya Blind) olarak Extrude edin.",
      "İç 90° dik birleşme köşesine R8mm iç radayüs (fillet) komutu uygulayın.",
      "Dikey yüze ve yatay taban yüzüne 2'şer adet (toplam 4 adet) Ø10mm delik açın. Delik eksenlerini kenarlardan 15mm ve 30mm simetrik konumlandırın.",
      "Model malzeme özelliğini 'Alüminyum 6061-T6' olarak atayın.",
      "Kütle Özellikleri (Mass Properties) penceresinden toplam ağırlığı doğrulayın (Hedef: ~192.4g)."
    ],
    stepsEN: [
      "Draw the 80mm × 80mm L profile on Front Plane with an 8mm wall thickness.",
      "Extrude the sketch by 60mm.",
      "Apply an R8mm inner fillet to the internal 90° corner.",
      "Cut 4 × Ø10mm holes (2 on vertical face, 2 on base) located 15mm from edges.",
      "Assign material property as 'Aluminum 6061-T6'.",
      "Verify the part total mass in Mass Properties (Target: ~192.4g)."
    ],

    // SECTION 4 - EXAMPLE SOLUTION
    solutionData: {
      material: "Alüminyum 6061-T6 (AlLoy 6061)",
      thickness: "8.00 mm",
      weight: "192.43 g",
      loadCapacity: "500 N (S_f = 2.4)",
      criticalValues: [
        { labelTR: "Atanan Malzeme", labelEN: "Assigned Material", value: "Al 6061-T6" },
        { labelTR: "Et Kalınlığı (t)", labelEN: "Wall Thickness (t)", value: "8.00 mm" },
        { labelTR: "Toplam Parça Ağırlığı", labelEN: "Total Part Mass", value: "192.43 g", highlight: true },
        { labelTR: "Max von Mises Gerilmesi", labelEN: "Max von Mises Stress", value: "42.1 MPa" },
        { labelTR: "Statik Emniyet Faktörü", labelEN: "Static Factor of Safety", value: "n = 2.41", highlight: true },
        { labelTR: "Max Sehim / Çökme", labelEN: "Max Deflection", value: "0.31 mm" }
      ],
      designDecisions: [
        {
          id: "r8-fillet",
          questionTR: "Neden R8 kavis (fillet) eklendi?",
          questionEN: "Why was an R8 fillet added?",
          explanationTR: "Keskin 90° iç köşeler von Mises gerilme yığılmasına (stress concentration factor K_t ≈ 3.2) sebep olur. R8 radayüsü gerilmeyi keskin köşeden geniş alana yayarak gerilme zirvesini %65 oranında düşürür ve yorulma ömrünü uzatır.",
          explanationEN: "Sharp 90° inner corners create severe von Mises stress concentration (K_t ≈ 3.2). The R8 fillet distributes force across a wider radius, reducing peak stress by 65% and extending fatigue life."
        },
        {
          id: "thickness-8mm",
          questionTR: "Neden 8mm et kalınlığı seçildi?",
          questionEN: "Why was 8mm thickness chosen?",
          explanationTR: "500N dikey yük altında 6mm kalınlık kullanılsaydı sehım (deflection) 0.82mm seviyesine çıkıp rijitlik kaybına yol açacaktı. 8mm kalınlık parçayı 192 gramda tutarken sehimi 0.31mm'ye düşürmüş ve n=2.41 emniyet katsayısı sağlamıştır.",
          explanationEN: "At 6mm thickness, deflection under 500N load reached 0.82mm causing loss of stiffness. 8mm thickness reduced deflection to 0.31mm with a safety factor of n=2.41 while keeping total mass under 200g."
        },
        {
          id: "edge-offset-15mm",
          questionTR: "Neden delikler kenarlardan 15mm içeride?",
          questionEN: "Why are holes offset 15mm from edges?",
          explanationTR: "Makine elemanları kuralına göre delik merkezinin serbest kenara mesafesi d ≥ 1.5 × d_delik (1.5 × 10mm = 15mm) olmalıdır. Bu güvenlik mesafesi civata sıkma anında kenar yırtılması (edge shear-out) veya çatlamayı önler.",
          explanationEN: "According to machine element rules, hole center distance to edge should satisfy d ≥ 1.5 × d_hole (15mm for Ø10). This prevents edge shear-out or cracking during bolt torque loading."
        }
      ],
      annotations: [
        { x: 30, y: 40, labelTR: "R8 fillet — gerilme yığılmasını önler", labelEN: "R8 fillet — prevents stress concentration" },
        { x: 70, y: 30, labelTR: "Ø10 montaj delikleri (15mm kenar ofseti)", labelEN: "Ø10 mounting holes (15mm edge offset)" },
        { x: 20, y: 75, labelTR: "t=8mm et kalınlığı", labelEN: "t=8mm wall thickness" },
        { x: 60, y: 80, labelTR: "500N dikey yük uygulama noktası", labelEN: "500N vertical load application point" }
      ]
    },

    // SECTION 5 - EVALUATION
    evaluationCriteria: [
      { id: 1, textTR: "4 montaj deliğinin hepsi Ø10 mm çapında ve doğru konumlandırılmış mı? (15mm kenar mesafesi)", textEN: "Are all 4 mounting clearance holes Ø10 mm and correctly positioned? (15mm edge distance)" },
      { id: 2, textTR: "L profilinin iç köşesinde R8 mm birleşme kavisi (fillet) bulunuyor mu?", textEN: "Is an R8 mm inner fillet applied to the interior L-corner?" },
      { id: 3, textTR: "Et kalınlığı tam olarak 8.0 mm ve dış boyutlar 80mm x 80mm x 60mm tutuyor mu?", textEN: "Is the wall thickness exactly 8.0 mm and outer dimensions 80mm x 80mm x 60mm?" },
      { id: 4, textTR: "Montaj delikleri kenarlardan d ≥ 15 mm güvenlik mesafesinde mi?", textEN: "Are mounting holes offset at least 15 mm from outer boundaries?" },
      { id: 5, textTR: "CAD malzeme tanımlaması sonrası toplam kütle 190g - 195g aralığında mı? (Gerçek: 192.43g)", textEN: "Is total calculated CAD mass between 190g - 195g? (Actual: 192.43g)" },
      { id: 6, textTR: "Teknik resimde temel görünüşler (Ön, Üst, İzometrik) ve ölçülendirme eksiksiz mi?", textEN: "Does the 2D drawing sheet include Front, Top, Isometric views and full dimensions?" }
    ]
  },
  {
    id: 2,
    code: "ENG-002",
    titleTR: "Kademeli Mil Tasarımı",
    titleEN: "Stepped Shaft Design",
    difficulty: "Başlangıç",
    difficultyColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    skills: ["CAD", "Teknik Resim", "Dönel Elemanlar", "Pah & Kavis"],
    estimatedTime: "1-2 saat / hrs",
    descriptionTR: "Rulman ve dişli montajına uygun kademeli güç aktarım mili. Pah ve pah kavis detayları ile toleranslandırma.",
    descriptionEN: "Stepped power transmission shaft suitable for bearing and gear fitment with chamfer and fillet details.",
    isPremium: false,

    contextTR: "Kademeli miller elektrik motorlarında, otomotiv şanzımanlarında ve pompa sistemlerinde tork aktarımı sağlar. Farklı çap adımları rulmanların ve dişlilerin eksenel yönde sabitlenmesini (omuz dayanağı) sağlar. Yanlış omuz kavisleri rulman sıkışmasına veya mil kırılmasına neden olur.",
    contextEN: "Stepped shafts transmit torque in motors, gearboxes and pumps. Diameter steps provide axial positioning shoulders for bearings and gears. Improper shoulder radii lead to bearing binding or fatigue failure.",

    briefScenarioTR: "İki adet bilyalı rulman ve bir düz dişli taşıyacak kademeli bir tahrik mili modelleyin. Rulman oturma yerleri Ø25mm (h6 toleransı), orta dişli oturma yeri Ø32mm olmalıdır.",
    briefScenarioEN: "Model a stepped drive shaft carrying two ball bearings and one spur gear. Bearing seats must be Ø25mm (h6 tolerance) and central gear seat Ø32mm.",
    constraintsTR: [
      "Malzeme: İmalat Çeliği AISI 1045 (E = 205 GPa)",
      "Toplam Mil Uzunluğu: 160 mm",
      "Kademeler: Ø20mm (L=30mm), Ø25mm (L=40mm), Ø32mm (L=50mm), Ø25mm (L=40mm)",
      "Pah Detayları: Mil uçlarında 1.5mm × 45° montaj pahı",
      "Kademe Kavisleri: Gerilme düşürücü R1.5 mm fillet"
    ],
    constraintsEN: [
      "Material: Medium Carbon Steel AISI 1045 (E = 205 GPa)",
      "Total Shaft Length: 160 mm",
      "Steps: Ø20mm (L=30mm), Ø25mm (L=40mm), Ø32mm (L=50mm), Ø25mm (L=40mm)",
      "Chamfers: 1.5mm × 45° lead-in chamfers at shaft ends",
      "Shoulder Fillets: R1.5 mm stress reduction radii"
    ],
    deliverablesTR: ["Dönel Katı Model (.STEP)", "Ölçülendirilmiş Dönel Teknik Resim (.PDF)"],
    deliverablesEN: ["Rotational Solid Model (.STEP)", "Dimensioned Turning Technical Drawing (.PDF)"],

    drawingTitle: "DWG-ENG-002: KADEMELİ MİL VE RULMAN YATAKLAMASI",
    keyDimensions: [
      { label: "Toplam Uzunluk / Total Length", val: "160 mm" },
      { label: "Orta Çap / Center Diameter", val: "Ø32.0 mm" },
      { label: "Rulman Çapı / Bearing Seats", val: "2× Ø25.0 mm" },
      { label: "Uç Çaplar / Shaft Ends", val: "Ø20.0 mm" },
      { label: "Giriş Pahları / Lead Chamfer", val: "1.5 mm × 45°" },
      { label: "Omuz Kavisleri / Radii", val: "R1.5 mm" }
    ],
    drawingSvgType: 'stepped-shaft',

    stepsTR: [
      "Right veya Front Plane'de mil dönel eksen çizgisini (Centerline - 160mm) oluşturun.",
      "Mil profilinin üst yarısını kademeler halinde çizin (Çapların yarısını radyal ölçülendirin).",
      "Revolve Boss/Base (Döndürerek Katı Oluştur) komutu ile 360° katı modeli oluşturun.",
      "Omuz geçiş köşelerine R1.5mm fillet radayüsleri uygulayın.",
      "Mil uç dış kenarlarına 1.5mm × 45° pah (chamfer) ekleyin.",
      " AISI 1045 Çelik malzemesi atayarak kütleyi kontrol edin (Hedef: ~718.5g)."
    ],
    stepsEN: [
      "Draw the 160mm horizontal centerline on Front or Right plane.",
      "Sketch top half of shaft step profile using radial dimensions.",
      "Apply 360° Revolve Boss/Base command.",
      "Add R1.5mm fillet radii at step transitions.",
      "Add 1.5mm × 45° chamfers at outer shaft tips.",
      "Assign AISI 1045 steel and check mass (Target: ~718.5g)."
    ],

    solutionData: {
      material: "AISI 1045 Isıl İşlem Görmüş Çelik",
      thickness: "Kademeli Çap (Max Ø32mm)",
      weight: "718.50 g",
      loadCapacity: "120 Nm Tork Aktarımı",
      criticalValues: [
        { labelTR: "Atanan Malzeme", labelEN: "Assigned Material", value: "AISI 1045 Steel" },
        { labelTR: "Toplam Mil Boyu", labelEN: "Total Shaft Length", value: "160.0 mm" },
        { labelTR: "Hesaplanan Kütle", labelEN: "Calculated Mass", value: "718.50 g", highlight: true },
        { labelTR: "Max Burulma Gerilmesi", labelEN: "Max Shear Stress", value: "38.2 MPa" },
        { labelTR: "Rulman Geçiş Toleransı", labelEN: "Bearing Fit Tolerance", value: "Ø25 h6 (-0.013)" }
      ],
      designDecisions: [
        {
          id: "shoulder-radius",
          questionTR: "Neden R1.5mm kademe kavisleri zorunludur?",
          questionEN: "Why are R1.5mm shoulder radii mandatory?",
          explanationTR: "Keskin mil kademeleri milin dönel burulma altında en zayıf noktasıdır. R1.5mm radayüs, burulma gerilmesini dairesel dağıtarak mil yorulma kırılmalarını engeller.",
          explanationEN: "Sharp shaft step transitions are the primary failure point under torsional loading. R1.5mm radii smooth out shear stress, preventing fatigue fatigue fracture."
        },
        {
          id: "shaft-chamfers",
          questionTR: "Uçlardaki 1.5mm pahın amacı nedir?",
          questionEN: "What is the purpose of the 1.5mm tip chamfers?",
          explanationTR: "Pahlar, rulmanların ve dişlilerin monte edilirken mil yüzeyini çizmesini engeller ve montaj merkezlemesini sağlar (lead-in chamfer).",
          explanationEN: "Chamfers prevent surface scoring during press-fit bearing installation and serve as self-centering assembly guides."
        }
      ],
      annotations: [
        { x: 15, y: 50, labelTR: "1.5mm x 45° Giriş Pahı", labelEN: "1.5mm x 45° Lead Chamfer" },
        { x: 40, y: 40, labelTR: "Ø25 h6 Rulman Yatağı", labelEN: "Ø25 h6 Bearing Seat" },
        { x: 50, y: 25, labelTR: "Ø32 Dişli Oturma Yüzeyi", labelEN: "Ø32 Gear Seat Area" },
        { x: 62, y: 38, labelTR: "R1.5 Gerilme Düşürücü Kavis", labelEN: "R1.5 Stress Relief Fillet" }
      ]
    },

    evaluationCriteria: [
      { id: 1, textTR: "Mil kademe çapları (Ø20, Ø25, Ø32, Ø25) ve boyları doğru mu?", textEN: "Are shaft step diameters (Ø20, Ø25, Ø32, Ø25) and lengths correct?" },
      { id: 2, textTR: "Omuz kademe geçişlerine R1.5 mm fillet kavisleri uygulandı mı?", textEN: "Were R1.5 mm fillets applied at all internal shoulder steps?" },
      { id: 3, textTR: "Dış montaj kenarlarına 1.5mm × 45° pah verildi mi?", textEN: "Were 1.5mm × 45° lead-in chamfers added to outer tips?" },
      { id: 4, textTR: "AISI 1045 çelik malzemesi atanıp ağırlık ~718.5g olarak doğrulandı mı?", textEN: "Was AISI 1045 assigned and mass confirmed around ~718.5g?" },
      { id: 5, textTR: "Teknik resimde eksen çizgileri (centerline) ve çap sembolleri (Ø) eksiksiz mi?", textEN: "Are centerlines and diameter symbols (Ø) present on 2D drawing?" }
    ]
  },
  {
    id: 3,
    code: "ENG-003",
    titleTR: "Flanşlı Bağlantı Elemanı",
    titleEN: "Flanged Connector",
    difficulty: "Orta",
    difficultyColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    skills: ["CAD", "Dairesel Dizi", "Kalıp Hazırlığı", "Kesit Görünüş"],
    estimatedTime: "1-2 saat / hrs",
    descriptionTR: "Boru hatlarında ve basınçlı kaplarda kullanılan 6 cıvatalı simetrik flanş rekor modeli.",
    descriptionEN: "6-bolt symmetric flange connector used in fluid pipelines and pressure vessels.",
    isPremium: false,

    contextTR: "Flanşlar boru hatlarını, vanaları ve pompaları sızdırmaz bir şekilde birleştirmek için kullanılır. Cıvata deliklerinin dairesel dizi (circular pattern) ile eşit açısal aralıkta açılması montajda cıvataların dengeli sıkılmasını sağlayan kritik bir mühendislik şartıdır.",
    contextEN: "Flanges connect piping, valves, and pumps with high pressure sealing. Bolt holes arranged in an exact circular pattern ensure uniform bolt clamping pressure during installation.",

    briefScenarioTR: "DN50 boru hattına uygun 6 cıvatalı yüksek basınç flanşı tasarlayın. Flanş 120mm dış çapa, 60mm iç geçiş çapına ve 6 adet Ø12mm dairesel montaj deliğine sahip olmalıdır.",
    briefScenarioEN: "Design a 6-bolt high pressure flange for a DN50 pipe line with 120mm outer diameter, 60mm inner bore, and 6 × Ø12mm circular hole pattern.",
    constraintsTR: [
      "Malzeme: Paslanmaz Çelik AISI 316L (Sızdırmazlık ve korozyon direnci)",
      "Dış Çap (OD): Ø120 mm, İç Çap (ID): Ø60 mm",
      "Cıvata Eksen Dairesi (PCD): Ø95 mm",
      "Delik Sayısı: 6 adet eşit aralıklı Ø12 mm delik (Circular Pattern)",
      "Flanş Et Kalınlığı: 14 mm, Göbek Çıkıntısı: Ø80mm x 10mm"
    ],
    constraintsEN: [
      "Material: Stainless Steel AISI 316L (Corrosion resistant)",
      "Outer Diameter (OD): Ø120 mm, Inner Bore (ID): Ø60 mm",
      "Pitch Circle Diameter (PCD): Ø95 mm",
      "Hole Pattern: 6 equally spaced Ø12 mm holes (Circular Pattern)",
      "Flange Thickness: 14 mm, Hub Extension: Ø80mm x 10mm"
    ],
    deliverablesTR: ["Flanş Katı Modeli (.STEP)", "Kesit Görünüşlü Teknik Resim (.PDF)"],
    deliverablesEN: ["Flange Solid Model (.STEP)", "Section View Technical Drawing (.PDF)"],

    drawingTitle: "DWG-ENG-003: BASINÇLI FLANŞ VE CIVATA DIZİLİMİ",
    keyDimensions: [
      { label: "Dış Çap / Outer Diameter", val: "Ø120.0 mm" },
      { label: "İç Çap / Inner Bore", val: "Ø60.0 mm" },
      { label: "Eksen Dairesi / PCD", val: "Ø95.0 mm" },
      { label: "Cıvata Delikleri / Bolt Holes", val: "6× Ø12.0 mm" },
      { label: "Flanş Kalınlığı / Flange Thk", val: "14.0 mm" },
      { label: "Göbek Çapı / Hub Diameter", val: "Ø80.0 mm" }
    ],
    drawingSvgType: 'flanged-connector',

    stepsTR: [
      "Top Plane üzerinde Ø120mm ve Ø60mm çemberler çizip 14mm kalınlığında Extrude edin.",
      "Üst yüze Ø80mm göbek dairesini çizin ve 10mm ilave yükseklik extrude edin.",
      "Ø95mm eksen dairesi (PCD) üzerinde 12 o'clock yönünde 1 adet Ø12mm delik açın.",
      "Circular Feature Pattern (Dairesel Dizi) komutu ile deliği 360° etrafında 6 adede çoğaltın.",
      "İç Akış boru kenarına 2mm x 45° pah, dış montaj kenarlarına R3mm fillet uygulayın.",
      "AISI 316L Paslanmaz Çelik malzeme atayıp ağırlığı doğrulayın (~942.1g)."
    ],
    stepsEN: [
      "Draw Ø120mm outer and Ø60mm inner circles on Top Plane, extrude 14mm.",
      "Sketch Ø80mm hub circle on top face and extrude additional 10mm.",
      "Create 1 × Ø12mm hole on PCD Ø95mm at 12 o'clock orientation.",
      "Use Circular Feature Pattern to replicate hole into 6 equal instances over 360°.",
      "Apply 2mm x 45° chamfer to inner bore and R3mm fillet to outer flange step.",
      "Assign AISI 316L Stainless Steel material and verify mass (~942.1g)."
    ],

    solutionData: {
      material: "Paslanmaz Çelik AISI 316L",
      thickness: "Flanş: 14mm, Toplam: 24mm",
      weight: "942.10 g",
      loadCapacity: "PN16 Basınç Sınıfı",
      criticalValues: [
        { labelTR: "Atanan Malzeme", labelEN: "Assigned Material", value: "AISI 316L Stainless" },
        { labelTR: "Eksen Dairesi (PCD)", labelEN: "Pitch Circle Dia (PCD)", value: "Ø95.0 mm" },
        { labelTR: "Toplam Parça Ağırlığı", labelEN: "Total Part Mass", value: "942.10 g", highlight: true },
        { labelTR: "Delik Açısal Aralığı", labelEN: "Hole Angular Spacing", value: "60.0° (Eşit)" }
      ],
      designDecisions: [
        {
          id: "circular-pcd",
          questionTR: "Neden dairesel eksen (PCD) üzerinden dizilim yapılır?",
          questionEN: "Why pattern bolt holes along PCD circle?",
          explanationTR: "Cıvataların Ø95mm dairesinde simetrik yerleşimi, conta üzerine uygulanan sıkma basıncının homojen yayılmasını sağlar ve yüksek akışkan basınçlarında sızıntıyı engeller.",
          explanationEN: "Symmetric layout on PCD Ø95mm ensures uniform gasket seating pressure, eliminating fluid leakage under elevated pipeline pressure."
        }
      ],
      annotations: [
        { x: 50, y: 15, labelTR: "Ø95mm Eksen Dairesi (PCD)", labelEN: "Ø95mm Pitch Circle (PCD)" },
        { x: 80, y: 40, labelTR: "6x Ø12mm Eşit Aralıklı Delikler", labelEN: "6x Ø12mm Equally Spaced Holes" },
        { x: 50, y: 70, labelTR: "Ø60mm İç Akış Kanalı", labelEN: "Ø60mm Inner Fluid Bore" }
      ]
    },

    evaluationCriteria: [
      { id: 1, textTR: "Eksen dairesi (PCD) Ø95 mm olarak tam ayarlandı mı?", textEN: "Is pitch circle diameter (PCD) set to exactly Ø95 mm?" },
      { id: 2, textTR: "6 adet Ø12 mm delik dairesel dizi ile 60° eşit açılarla çoğaltıldı mı?", textEN: "Are 6 × Ø12 mm holes patterned equally at 60° increments?" },
      { id: 3, textTR: "İç delik Ø60 mm ve dış çap Ø120 mm ölçülerinde mi?", textEN: "Does inner bore measure Ø60 mm and outer flange Ø120 mm?" },
      { id: 4, textTR: "AISI 316L malzemesi atanıp ağırlık ~942g civarında teyit edildi mi?", textEN: "Was AISI 316L material assigned and weight confirmed ~942g?" }
    ]
  },
  {
    id: 4,
    code: "ENG-004",
    titleTR: "L-Braket Hafifletme + FEA Analizi",
    titleEN: "Lightweighting L-Bracket + FEA",
    difficulty: "Orta",
    difficultyColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    skills: ["CAD", "FEA Analizi", "Topoloji Optimizasyonu", "Hafifletme"],
    estimatedTime: "3-4 saat / hrs",
    descriptionTR: "Mevcut L-braketi gerilme yığılması yaşanmayan bölgelerden boşaltarak kütleyi %35 azaltma ve FEA simülasyonu.",
    descriptionEN: "Lightweight existing L-bracket by pocketing low-stress zones, reducing mass by 35% with FEA validation.",
    isPremium: false,

    contextTR: "Havacılık ve uzay sanayiinde her gram ekstra ağırlık, uyduların ve uçakların yakıt maliyetini artırır. Bu görevde temel L-braketi alıp Sonlu Elemanlar Analizi (FEA) sonuçlarına göre düşük gerilmeli 'ölü bölgeleri' malzeme boşaltma (pocketing) veya destek berkitme kaburgaları (rib) ekleyerek optimize edeceksiniz.",
    contextEN: "In aerospace, every extra gram increases launch cost. In this task, you will take the base L-bracket, run FEA stress simulation, and lightweight 'dead zones' via pocketing while maintaining structural yield safety.",

    briefScenarioTR: "ENG-001 L-braketini baz alarak, 500N yük altında emniyet faktörünü n ≥ 1.8 tutmak şartıyla parça kütlesini 192 gramdan 125 gramın altına düşürün.",
    briefScenarioEN: "Based on the ENG-001 bracket, reduce component mass from 192g to under 125g while maintaining a minimum FEA safety factor n ≥ 1.8 under 500N load.",
    constraintsTR: [
      "Orijinal Ağırlık: 192.43 g → Hedef Ağırlık: < 125 g (%35+ Hafifletme)",
      "Maksimum Kabul Edilebilir von Mises Gerilmesi: < 150 MPa (Yield: 276 MPa)",
      "FEA Yükleme: Taban deliklerinden Ankastre (Fixed Support), üst deliğe 500N Dikey Yük",
      "FEA Mesh: 2.0 mm Tetrahedral İnce Mesh"
    ],
    constraintsEN: [
      "Original Mass: 192.43 g → Target Mass: < 125 g (35%+ Reduction)",
      "Maximum Allowable von Mises Stress: < 150 MPa (Yield: 276 MPa)",
      "FEA Boundary Conditions: Fixed Support at base holes, 500N Force at top hole",
      "FEA Mesh: 2.0 mm Fine Tetrahedral Mesh"
    ],
    deliverablesTR: ["Hafifletilmiş 3B CAD Modeli (.STEP)", "FEA Gerilme & Sehim Analiz Raporu (.PDF)"],
    deliverablesEN: ["Lightweighted 3D CAD Model (.STEP)", "FEA Stress & Displacement Report (.PDF)"],

    drawingTitle: "DWG-ENG-004: FEA DESTEKLİ OPTİMİZE BRAKET",
    keyDimensions: [
      { label: "Orijinal Ağırlık / Base Mass", val: "192.4 g" },
      { label: "Hedef Ağırlık / Target Mass", val: "< 125.0 g" },
      { label: "Yan Boşaltma / Side Pocket", val: "R18 mm / Depth 4mm" },
      { label: "Destek Kaburgası / Center Rib", val: "t=5.0 mm" },
      { label: "FEA Max Gerilme / Max Stress", val: "112.4 MPa" },
      { label: "FEA Min Emniyet / Min FOS", val: "n = 2.45" }
    ],
    drawingSvgType: 'l-bracket-fea',

    stepsTR: [
      "ENG-001 modelini açın ve yan et yüzeylerinde gerilmesiz nötr eksen bölgelerini tespit edin.",
      "Yan yüzeylerden 4mm derinliğinde cep boşaltma (pocketing) cepleri açın veya merkez berkitme ribi tasarlayın.",
      "CAD ortamında Simulation/FEA modülünü başlatın.",
      "Taban delik iç yüzeylerini 'Fixed Geometry' (Sabit Mesnet) yapın.",
      "Üst montaj deliklerine dikey -Y yönünde 500N kuvvet uygulayın.",
      "Mesh boyutunu 2mm yaparak analizi çalıştırın (Solve).",
      "von Mises gerilme dağılımında kırımızı sıcak bölgelerin 150 MPa altında kaldığını ve kütlenin < 125g olduğunu teyit edin."
    ],
    stepsEN: [
      "Open ENG-001 model and locate low-stress neutral axis zones.",
      "Cut 4mm deep pockets on side surfaces or introduce a central triangular rib stiffener.",
      "Activate Simulation / FEA study module.",
      "Set base hole cylindrical surfaces as Fixed Geometry.",
      "Apply 500N force downward (-Y direction) on top hole.",
      "Mesh the body with 2mm element size and click Solve.",
      "Verify peak von Mises stress remains below 150 MPa and total mass is < 125g."
    ],

    solutionData: {
      material: "Alüminyum 6061-T6",
      thickness: "Cepli Gövde (3mm web + 5mm rib)",
      weight: "121.80 g (%36.7 Hafifletme)",
      loadCapacity: "500 N (Emniyet n = 2.45)",
      criticalValues: [
        { labelTR: "Optimizasyon Öncesi Kütle", labelEN: "Pre-Optimization Mass", value: "192.43 g" },
        { labelTR: "Optimizasyon Sonrası Kütle", labelEN: "Post-Optimization Mass", value: "121.80 g", highlight: true },
        { labelTR: "Kütle Kazancı", labelEN: "Mass Saved", value: "%36.7 Azalma" },
        { labelTR: "FEA Max von Mises", labelEN: "FEA Max von Mises", value: "112.4 MPa" },
        { labelTR: "Emniyet Katsayısı (FOS)", labelEN: "Safety Factor (FOS)", value: "n = 2.45", highlight: true }
      ],
      designDecisions: [
        {
          id: "topology-rib",
          questionTR: "Neden cep boşaltma (pocketing) yöntemi seçildi?",
          questionEN: "Why was pocketing selected for lightweighting?",
          explanationTR: "Braketin orta nötr düzlemi bending (eğilme) mometinde düşük gerilmeye maruz kalır. Dış flanş et kalınlıklarını koruyup iç gövdeyi 4mm ceplerle boşaltmak rijitliği %90 korurken kütleyi 70.6g azaltmıştır.",
          explanationEN: "The central neutral plane carries minimal bending moment. Retaining outer boundary flanges while pocketing internal webs by 4mm preserved 90% stiffness while removing 70.6g of dead weight."
        }
      ],
      annotations: [
        { x: 35, y: 35, labelTR: "FEA Düşük Gerilme Bölgesi (Mavi) — 4mm Cep Boşaltma", labelEN: "FEA Low Stress Zone (Blue) — 4mm Pocket Cut" },
        { x: 65, y: 25, labelTR: "FEA Max Gerilme Noktası (Kırmızı/Sarı) — 112.4 MPa", labelEN: "FEA Max Stress Point (Red/Yellow) — 112.4 MPa" },
        { x: 25, y: 75, labelTR: "Ankastre Mesnet (Fixed)", labelEN: "Fixed Constraint" }
      ]
    },

    evaluationCriteria: [
      { id: 1, textTR: "Parça kütlesi 125.0 gramın altına düşürüldü mü? (Gerçek: 121.8g)", textEN: "Is component mass reduced under 125.0 grams? (Actual: 121.8g)" },
      { id: 2, textTR: "FEA analizinde 500N yük altında emniyet faktörü n ≥ 1.8 sağlandı mı?", textEN: "Is FEA factor of safety n ≥ 1.8 maintained under 500N force?" },
      { id: 3, textTR: "Ankastre mesnet ve yük tanımlamaları doğru sınır şartlarıyla uygulandı mı?", textEN: "Were fixed supports and load vectors configured with correct boundary conditions?" },
      { id: 4, textTR: "FEA gerilme dağılımı ısı haritası ve raporda gösterildi mi?", textEN: "Is von Mises stress contour heatmap included in deliverables?" }
    ]
  },
  {
    id: 5,
    code: "ENG-005",
    titleTR: "Şanzıman Gövde Montajı & Tolerans",
    titleEN: "Gearbox Housing & Tolerances",
    difficulty: "İleri",
    difficultyColor: "bg-red-500/20 text-red-400 border-red-500/40",
    skills: ["Montaj", "GD&T", "Tolerans Analizi", "Sızdırmazlık"],
    estimatedTime: "5-6 saat / hrs",
    descriptionTR: "İki kademeli helisel dişli kutusu gövde montajı, ISO tolerans zinciri ve GD&T diklik/eşeksenlilik gereksinimleri.",
    descriptionEN: "Two-stage helical gearbox assembly, ISO tolerance chain analysis, and GD&T geometric tolerancing.",
    isPremium: true,

    contextTR: "Dişli kutusu montajında eksenel tolerans hatası dişli çarkların diş yüzeylerinin düzensiz aşınmasına, gürültüye ve ısınmaya sebep olur. Bu görevde montaj zincirini kurup GD&T kurallarına uygun toleranslandırma yapacaksınız.",
    contextEN: "In gearbox assemblies, stack-up tolerance errors lead to premature tooth wear, noise and thermal overload. In this task you build the complete assembly and execute ISO GD&T tolerance analysis.",

    briefScenarioTR: "Döküm alüminyum helisel dişli kutusu alt ve üst gövde montajını gerçekleştirin. Rulman yatak eşeksenliliği (coaxiality) < 0.02mm ve yüzey dikliği < 0.03mm olmalıdır.",
    briefScenarioEN: "Assemble cast aluminum lower and upper gearbox housings. Ensure bearing seat coaxiality < 0.02mm and face perpendicularity < 0.03mm.",
    constraintsTR: [
      "Premium Kilitli Görev",
      "Gerekli Beceriler: 3D Assembly, Bottom-Up Modeling, GD&T ISO 1101",
      "İçerik: Alt/Üst Gövde, Mil, Rulmanlar, Keçeler, Cıvatalar"
    ],
    constraintsEN: [
      "Premium Locked Task",
      "Required Skills: 3D Assembly, Bottom-Up Modeling, GD&T ISO 1101",
      "Content: Upper/Lower Housing, Shafts, Bearings, Seals, Fasteners"
    ],
    deliverablesTR: ["Komple Montaj Dosyası (.SLDASM)", "GD&T Tolerans Paftası (.PDF)"],
    deliverablesEN: ["Complete Assembly File (.SLDASM)", "GD&T Toleranced Sheet (.PDF)"],

    drawingTitle: "DWG-ENG-005: ŞANZIMAN MONTAJ VE TOLERANS PAFTASI",
    keyDimensions: [
      { label: "Eksen Mesafesi / Center Distance", val: "110.00 ±0.02 mm" },
      { label: "Yatak Eşeksenliliği / Coaxiality", val: "Ø0.015 A-B" },
      { label: "Yüzey Dikliği / Perpendicularity", val: "0.025 A" }
    ],
    drawingSvgType: 'stepped-shaft',

    stepsTR: ["Bu görev Pro Üyeliğe Özeldir. Tüm montaj parçalarını ve video eğitimi açmak için Pro'ya geçin."],
    stepsEN: ["This task is exclusive to Pro members. Upgrade to unlock all assembly components and video walkthrough."],

    solutionData: {
      material: "Döküm Alüminyum A380",
      thickness: "Döküm Et: 6mm",
      weight: "3420.00 g",
      loadCapacity: "450 Nm Tork",
      criticalValues: [],
      designDecisions: [],
      annotations: []
    },

    evaluationCriteria: []
  },
  {
    id: 6,
    code: "ENG-006",
    titleTR: "Sac Metal Muhafaza & Açınım",
    titleEN: "Sheet Metal Housing & Flat Pattern",
    difficulty: "Orta",
    difficultyColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    skills: ["Sac Metal", "Büküm", "K-Faktör", "Lazer Kesim"],
    estimatedTime: "2-3 saat / hrs",
    descriptionTR: "Elektronik kontrol kutusu için bükümlü sac metal muhafaza ve imalata uygun K-faktörlü lazer kesim açınımı.",
    descriptionEN: "Sheet metal enclosure for electronic control box with bend allowance and flat pattern DXF export.",
    isPremium: true,

    contextTR: "Sac metal imalatında 3B modelin açınımı (Flat Pattern) doğru hesaplanmazsa, büküm sonrası parçanın boyutları kayar ve cıvata delikleri denk gelmez. K-faktör ve Büküm İzni (Bend Allowance) hesabı sac metal mühendisliğinin temelidir.",
    contextEN: "In sheet metal fabrication, inaccurate flat pattern calculations cause misaligned holes after press brake bending. K-factor and Bend Allowance are core sheet metal engineering fundamentals.",

    briefScenarioTR: "1.5mm DKP saçtan elektronik cihaz muhafazası tasarlayın. Büküm yarıçapı R1.5mm, K-faktör 0.44 kabul edilerek DXF açınım paftasını hazırlayın.",
    briefScenarioEN: "Design a 1.5mm mild steel electronic housing. Set bend radius R1.5mm, K-factor 0.44 and generate accurate flat pattern DXF output.",
    constraintsTR: [
      "Premium Kilitli Görev",
      "Gerekli Beceriler: Sheet Metal Base Flange, Edge Flange, Flat Pattern, K-Factor",
      "Malzeme: DKP Sac 1.5mm (Galvaniz Kaplama)"
    ],
    constraintsEN: [
      "Premium Locked Task",
      "Required Skills: Sheet Metal Base Flange, Edge Flange, Flat Pattern, K-Factor",
      "Material: Mild Steel 1.5mm"
    ],
    deliverablesTR: ["3B Sac Metal Modeli (.STEP)", "Lazer Kesim Açınım Dosyası (.DXF)"],
    deliverablesEN: ["3D Sheet Metal Model (.STEP)", "Laser Cut Flat Pattern (.DXF)"],

    drawingTitle: "DWG-ENG-006: SAC METAL AÇINIM VE BÜKÜM PARATRAMETRELERİ",
    keyDimensions: [
      { label: "Sac Kalınlığı / Sheet Thickness", val: "1.50 mm" },
      { label: "Büküm Yarıçapı / Bend Radius", val: "R1.50 mm" },
      { label: "K-Faktör / K-Factor", val: "0.44" }
    ],
    drawingSvgType: 'l-bracket',

    stepsTR: ["Bu görev Pro Üyeliğe Özeldir."],
    stepsEN: ["This task is exclusive to Pro members."],

    solutionData: {
      material: "DKP Sac 1.5mm",
      thickness: "1.50 mm",
      weight: "485.00 g",
      loadCapacity: "IP54 Koruma Sınıfı",
      criticalValues: [],
      designDecisions: [],
      annotations: []
    },

    evaluationCriteria: []
  }
];
