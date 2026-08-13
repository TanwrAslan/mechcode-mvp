import { Task } from '@/types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'L-Braket Tasarımı ve Titreşim Dayanımı',
    shortDescription: 'Otomotiv ve iç montaj için 500N yük taşıyacak optimize edilmiş L-braket modelleme.',
    difficulty: 'Başlangıç',
    skillTags: ['CAD', 'Teknik Resim', 'Gerilme Yığılması', 'Sac Metal'],
    estimatedTime: '45 dk',
    isPremium: false,
    status: 'available',
    context: {
      useCase: 'Otomotiv Şase ve İç Montaj Sistemleri',
      realWorldExample: 'L-braketler otomotivde motor bileşenlerini şaseye bağlar, beyaz eşyada iç tambur ve kompresör montajında, endüstriyel raf sistemlerinde ana yük taşıyıcı eleman olarak kullanılır.',
      engineeringReason: 'Hafifletmek kritiktir çünkü araç toplam ağırlığı yakıt tüketimini ve menzili doğrudan etkiler. Aynı zamanda motor titreşimleri altında yorulma (fatigue) kırılması yaşanmamalıdır.',
      criticalFactor: 'Keskin dik iç köşelerde oluşan yüksek gerilme yığılması (stress concentration) ve cıvata deliklerinin kenara olan kritik mesafesi.'
    },
    brief: {
      scenario: 'Bir raf ve motor montaj modülünü duvara/şaseye tutturacak yüksek dayanımlı L-braket tasarla.',
      constraints: [
        '500 N statik düşey yükü emniyetli taşımalı (S ≥ 2.0).',
        'Mümkün olduğunca hafif olmalı (Hedef < 75 gram).',
        'Taban ve dikey yüzde toplam 4 adet Ø10 mm montaj deliği bulunmalı.',
        'Montaj delik merkezleri serbest kenarlardan en az 15 mm uzakta olmalı.'
      ],
      requiredOutput: '3D CAD Modeli (.STEP/.SLDPRT) ve 1:1 Ölçekli 2D Teknik Resim (PDF/DWG).',
      parameters: [
        { label: 'Statik Yük', value: '500 N' },
        { label: 'Emniyet Katsayısı', value: 'S = 2.0' },
        { label: 'Montaj Delikleri', value: '4x Ø10 mm' },
        { label: 'Hedef Kütle', value: '< 75 g' }
      ]
    },
    drawing: {
      dimensions: [
        { code: 'L1', value: '80 mm', note: 'Dikey Kol Yüksekliği' },
        { code: 'L2', value: '80 mm', note: 'Yatay Taban Genişliği' },
        { code: 'B', value: '40 mm', note: 'Braket Genişliği' },
        { code: 't', value: '8 mm', note: 'Et Kalınlığı' },
        { code: 'R', value: '8 mm', note: 'İç Köşe Fillet Yarıçapı' },
        { code: 'd', value: 'Ø10 mm', note: '4x Montaj Delik Çapı' },
        { code: 'e', value: '15 mm', note: 'Delik Merkez - Kenar Mesafesi' }
      ],
      material: 'Alüminyum 6061-T6 (Sy = 276 MPa)',
      scale: '1:1 ISO-E',
      tolerance: 'ISO 2768-m (Genel Tolerans ±0.2 mm)',
      svgType: 'bracket'
    },
    steps: [
      'CAD yazılımında (SolidWorks/NX/Inventor/Fusion) L profili taslağını oluşturun.',
      'İç köşeye keskin kalmayacak şekilde en az R8 mm fillet (kavis) ekleyin.',
      'Taban ve dikey kollara kenardan 15 mm içeride kalacak şekilde 2\'şer adet Ø10 mm delik açın.',
      'Malzeme kütüphanesinden Alüminyum 6061-T6 atayarak kütleyi doğrulayın.',
      'Teknik resim görünümünü çıkarıp tüm kritik ölçüleri ve görünmez çizgileri işaretleyin.'
    ],

    /**
     * Otomatik kontrol şartnamesi — yukarıdaki `drawing.dimensions` künyesinden
     * birebir türetildi. Diğer görevlere admin panelinden eklenir.
     *
     * NOT: `mass` bilerek KAPALI. Doğru hedef kütle, referans çözümün CAD'inden
     * (Mass Properties) okunup girilmeli; teknik resimden türetilen dolu prizma
     * yaklaşımı delikleri ve kavisleri saymadığı için yanıltıcı olur.
     */
    verification: {
      enabled: true,
      material: { name: 'Alüminyum 6061-T6', densityGcm3: 2.70 },
      boundingBox: { enabled: true, x: 80, y: 80, z: 40, toleranceMm: 0.5, weight: 25 },
      mass: { enabled: false, target: 0, tolerancePercent: 8, weight: 20 },
      wallThickness: { enabled: true, target: 8, toleranceMm: 0.5, weight: 20 },
      holes: { enabled: true, count: 4, diameterMm: 10, toleranceMm: 0.3, weight: 25 },
      minInnerRadius: { enabled: true, target: 8, toleranceMm: 0.5, weight: 15 },
      requireWatertight: true,
      passScore: 70,
    },

    exampleSolution: {
      title: 'MechStudio Referans L-Braket Çözümü',
      material: 'Alüminyum 6061-T6',
      weight: '66 g',
      weightReduction: '%45 Kütle Tasarrufu',
      safetyFactor: '2.2 (Max 500 N)',
      maxStress: '82.4 MPa (Von Mises)',
      annotations: [
        {
          id: 'ann-1',
          x: 38,
          y: 42,
          title: 'R8 mm İç Köşe Fillet',
          description: 'Keskin köşede oluşan gerilme yığılmasını %65 oranında düşürür. Yorulma ömrünü 4 kat artırır.',
          tag: 'Kritik Geometri'
        },
        {
          id: 'ann-2',
          x: 65,
          y: 72,
          title: '4x Ø10 mm Cıvata Delikleri',
          description: 'Standart M10 cıvata bağlantısı için. Delik etrafında pah (chamfer) kırılarak montaj kolaylaştırıldı.',
          tag: 'Bağlantı Elemanı'
        },
        {
          id: 'ann-3',
          x: 22,
          y: 28,
          title: '15 mm Kenar Güvenlik Mesafesi',
          description: 'Cıvata torklandığında sac kenarında kesme/yırtılma kırılmasını önleyen standart minimum mesafe.',
          tag: 'Mukavemet'
        },
        {
          id: 'ann-4',
          x: 52,
          y: 35,
          title: 'Ağırlık Boşaltma Cebi',
          description: 'Düşük gerilme oluşan orta bölgede malzeme boşaltılarak dayanım kaybetmeden 18 gram tasarruf sağlandı.',
          tag: 'Optimizasyon'
        }
      ],
      criticalValues: [
        { label: 'Malzeme Seçimi', standardValue: 'St37 Çelik', optimizedValue: 'Alüminyum 6061-T6', isImportant: true },
        { label: 'Et Kalınlığı (t)', standardValue: '12 mm', optimizedValue: '8 mm', unit: 'mm' },
        { label: 'Toplam Kütle', standardValue: '142 g', optimizedValue: '66 g', unit: 'g', isImportant: true },
        { label: 'Maks. Von Mises Gerilmesi', standardValue: '145 MPa', optimizedValue: '82.4 MPa', unit: 'MPa' },
        { label: 'Emniyet Katsayısı (S)', standardValue: '1.6', optimizedValue: '2.2', isImportant: true }
      ],
      designDecisions: [
        {
          title: 'Gerilme Yığılmasının Önlenmesi',
          explanation: 'L-braketin 90° iç birleşim noktasına R8 mm radüs eklendi. Keskin iç köşelerde gerilme yığılması katsayısı K_t = 3.2 seviyesinden 1.3 seviyesine düşürüldü.'
        },
        {
          title: 'Kenar Yırtılma Emniyeti',
          explanation: 'Delik merkezleri ile serbest kenar arasındaki mesafe cıvata çapının en az 1.5 katı (e ≥ 1.5d = 15mm) seçildi. Bu sayede cıvata torku altında kenar kayma kırılması engellendi.'
        },
        {
          title: 'Cebi Boşaltma ve Topoloji',
          explanation: 'Yük akış hatları dışında kalan nötr eksen yakınındaki bölgeler pahlanarak toplam kütlede %45 hafifletme elde edildi.'
        }
      ]
    },
    criteria: [
      { id: 'crit-1', text: '4 adet montaj deliği doğru konumda ve Ø10 mm çapında mı?', weight: 1 },
      { id: 'crit-2', text: 'İç köşede en az R8 mm fillet (kavis) var mı?', weight: 1 },
      { id: 'crit-3', text: 'Malzeme kalınlığı 500N yük için 8mm veya emniyetli aralıkta seçildi mi?', weight: 1 },
      { id: 'crit-4', text: 'Delik merkezleri kenarlardan en az 15mm mesafede mi?', weight: 1 },
      { id: 'crit-5', text: 'Parça toplam ağırlığı 60g - 75g aralığında mı?', weight: 1 },
      { id: 'crit-6', text: 'Teknik resimde tüm ölçüler, görünmez çizgiler ve başlık bloğu eksiksiz mi?', weight: 1 }
    ]
  },
  {
    id: 'task-2',
    title: 'Kademeli Mil ve Toleranslı Teknik Resim',
    shortDescription: 'Rulman yataklama ve dişli çark montajı için kademeli mil tasarımı ve ISO toleranslandırılması.',
    difficulty: 'Başlangıç',
    skillTags: ['CAD', 'Teknik Resim', 'Tolerans', 'Talaşlı İmalat'],
    estimatedTime: '60 dk',
    isPremium: false,
    status: 'available',
    context: {
      useCase: 'Elektrik Motoru & Redüktör Şanzıman Milleri',
      realWorldExample: 'Redüktörlerde gücü aktaran kademeli miller üzerinde bilyalı rulmanlar ve helis dişliler taşır. Kademeler rulmanların eksenel gezinmesini önler.',
      engineeringReason: 'Miller üzerindeki fatura (kademe) geçişlerinde keskin köşeler burulma ve eğilme momentleri altında kırılmaya yol açar. Ayrıca rulman çakılacak çaplarda k6/h6 gibi hassas ISO toleransları şarttır.',
      criticalFactor: 'Rulman montaj faturası radüsleri (r = 1.5mm) ve fatura dibi taşlama boşluk kanalları (DIN 509).'
    },
    brief: {
      scenario: 'Bir elektrik motorundan dişli kutusuna 15 kW güç aktaracak kademeli mil ve imalat teknik resmini oluştur.',
      constraints: [
        'Mil üzerinde 2 adet 6206 bilyalı rulman yatağı (Ø30k6) bulunmalı.',
        'Orta kısımda dişli çark oturma faturası (Ø40mm) ve kama yuvası (DIN 6885 Form A) olmalı.',
        'Mil uçlarında M12 diş ve fatura geçişlerinde r=1.5mm fillet yapılmalı.',
        'Torna imalatı için pah kırımları (2x45°) eklenmeli.'
      ],
      requiredOutput: '3D CAD Modeli + Tolerans ve Yüzey İşleme İşaretli 2D Teknik Resim.',
      parameters: [
        { label: 'Aktarılan Güç', value: '15 kW @ 1450 d/dk' },
        { label: 'Rulman Çapı', value: 'Ø30 k6 mm' },
        { label: 'Kama Yuvası', value: 'DIN 6885-A 8x7' },
        { label: 'Yüzey Pürüzlülüğü', value: 'Ra 0.8 µm (Rulman)' }
      ]
    },
    drawing: {
      dimensions: [
        { code: 'D1', value: 'Ø25 h6', note: 'Giriş Ucu Mil Çapı' },
        { code: 'D2', value: 'Ø30 k6', note: 'Rulman Yataklama Çapı' },
        { code: 'D3', value: 'Ø40 mm', note: 'Dişli Göbek Oturma Çapı' },
        { code: 'L_tot', value: '220 mm', note: 'Toplam Mil Boyu' },
        { code: 'b x h', value: '8 x 7 mm', note: 'Kama Yuvası Genişlik x Derinlik' },
        { code: 'r', value: '1.5 mm', note: 'Fatura Geçiş Radüsü' }
      ],
      material: 'Ç45 (SAE 1045) Isıl İşlem Çeliği',
      scale: '1:1 ISO-E',
      tolerance: 'ISO 286 (H7/k6 Rulman Geçme Toleransı)',
      svgType: 'stepped_shaft'
    },
    steps: [
      'Dönel profil taslağını eksen çizgisine göre çizin ve Döndürerek Katı Oluşturun (Revolve).',
      'Orta faturaya DIN 6885 standardına uygun 8mm genişliğinde kama yuvası (Keyway) ekleyin.',
      'Rulman oturma yüzeylerine k6 toleransı atayın.',
      'Kademeler arasına r=1.5mm radüsler ve mil uçlarına 2x45° imalat pahları kırın.',
      'Teknik resimde yüzey pürüzlülük sembollerini (Ra 0.8) ve tolerans değerlerini yerleştirin.'
    ],
    exampleSolution: {
      title: 'MechStudio Kademeli İmalat Mili Çözümü',
      material: 'Ç45 Isıl İşlemli Islah Çeliği',
      weight: '1.85 kg',
      weightReduction: 'Dengeli Mil Kütlesi',
      safetyFactor: '2.8 (Burulma & Eğilme)',
      maxStress: '112 MPa (Torsional Shear)',
      annotations: [
        {
          id: 'ann-s1',
          x: 35,
          y: 48,
          title: 'Ø30 k6 Rulman Oturma Yüzeyi',
          description: 'Tatlı sıkı rulman montajı için k6 toleransı. Yüzey pürüzlülüğü Ra 0.8 µm olmalıdır.',
          tag: 'Tolerans'
        },
        {
          id: 'ann-s2',
          x: 52,
          y: 35,
          title: 'DIN 6885-A Kama Yuvası',
          description: 'Dişli çarka tork aktaran 8x7 mm kama yuvası. Yuva tabanındaki radüs yorulmayı engeller.',
          tag: 'Tork Aktarımı'
        },
        {
          id: 'ann-s3',
          x: 25,
          y: 60,
          title: 'Fatura Radüsü & Taşlama Kanalı',
          description: 'Rulman iç bileziğinin köşeye tam oturması için r=1.5mm radüs ve DIN 509 taşlama kanalı.',
          tag: 'Montaj Kolaylığı'
        }
      ],
      criticalValues: [
        { label: 'Mil Malzemesi', standardValue: 'St52 Çelik', optimizedValue: 'Ç45 Islah Çeliği', isImportant: true },
        { label: 'Rulman Toleransı', standardValue: '±0.1 mm (Serbest)', optimizedValue: 'Ø30 k6 (Hassas Tatlı Sıkı)', isImportant: true },
        { label: 'Yüzey Pürüzlülüğü (Rulman)', standardValue: 'Ra 3.2 µm', optimizedValue: 'Ra 0.8 µm' },
        { label: 'Burulma Emniyet Katsayısı', standardValue: '1.8', optimizedValue: '2.8' }
      ],
      designDecisions: [
        {
          title: 'Dinamik Yüklerde Keskin Köşe Önlemi',
          explanation: 'Dönen millerde eğilme ve tork değişimleri yorulmaya neden olur. Fatura geçişlerindeki r=1.5mm radüs milin ömrünü 5 katına çıkarır.'
        },
        {
          title: 'Standart Kama Yuvası Geçişi',
          explanation: 'DIN 6885 standart kama yuvası parmak freze ile tek geçişte işlenecek şekilde tasarlanmıştır.'
        }
      ]
    },
    criteria: [
      { id: 'crit-s1', text: 'Rulman oturma çapı Ø30 k6 toleransı ile belirtildi mi?', weight: 1 },
      { id: 'crit-s2', text: 'Kama yuvası DIN 6885 standart boyutlarına (8x7mm) uygun mu?', weight: 1 },
      { id: 'crit-s3', text: 'Fatura geçişlerinde r=1.5mm radüsler ve uçlarda 2x45° pahlar var mı?', weight: 1 },
      { id: 'crit-s4', text: 'Rulman yüzeylerinde Ra 0.8 µm yüzey pürüzlülük işareti konuldu mu?', weight: 1 },
      { id: 'crit-s5', text: 'Teknik resimde eksen çizgileri ve merkez işaretleri eksiksiz mi?', weight: 1 }
    ]
  },
  {
    id: 'task-3',
    title: 'Süspansiyon Salıncak Kolu Hafifletme (FEA)',
    shortDescription: 'Otomotiv ön süspansiyon salıncak kolunda FEA analizi ile gerilmeleri inceleyip %35 kütle azaltımı sağlama.',
    difficulty: 'Orta',
    skillTags: ['CAD', 'FEA', 'Topoloji', 'Otomotiv', 'Alüminyum Döküm'],
    estimatedTime: '90 dk',
    isPremium: false,
    status: 'available',
    context: {
      useCase: 'Otomotiv Ön Süspansiyon Sistemleri (Wishbone Control Arm)',
      realWorldExample: 'Salıncak kolları tekerleği şaseye bağlar. Kasis, frenleme ve viraj alma esnasında şaseden tekerleğe gelen yüksek dinamik şok yüklerini taşır.',
      engineeringReason: 'Salıncak kolu "Unsprung Mass" (yaylanmayan kütle) sınıfındadır. Yaylanmayan kütlenin azaltılması sürüş konforunu, yol tutuşunu ve süspansiyon tepki süresini dramatik şekilde artırır.',
      criticalFactor: 'Dikey darbe yükünde (3000 N) ve yanal viraj torkunda kalıcı deformasyon olmaması.'
    },
    brief: {
      scenario: 'Mevcut 1.4 kg ağırlığındaki döküm çelik salıncak kolunu Alüminyum döküm ile yeniden tasarla ve topoloji optimizasyonu ile hafiflet.',
      constraints: [
        '3000 N düşey kasis yükü ve 1500 N yanal frenleme yüküne dayanmalı.',
        '3 bağlantı noktası eksen mesafeleri sabit tutulmalı (A-B-C burç geometrileri).',
        'Maksimum ağırlık 850 gramı geçmemeli.',
        'Von Mises gerilmesi Alüminyum 356-T6 akma sınırının (185 MPa) altında kalmalı.'
      ],
      requiredOutput: 'Hafifletilmiş 3D CAD Modeli ve FEA Gerilme Dağılımı Raporu.',
      parameters: [
        { label: 'Kasis Yükü', value: '3000 N (Z ekseni)' },
        { label: 'Frenleme Yükü', value: '1500 N (X ekseni)' },
        { label: 'Maks. İzin Verilen Kütle', value: '850 g' },
        { label: 'Malzeme', value: 'Al-356-T6 Döküm' }
      ]
    },
    drawing: {
      dimensions: [
        { code: 'L_AB', value: '280 mm', note: 'Ana Burçlar Arası Eksen Mesafesi' },
        { code: 'L_C', value: '190 mm', note: 'Rotil Bağlantı Mesafesi' },
        { code: 'D_bush', value: 'Ø42 mm', note: 'Şase Burç Yuvası Çapı' },
        { code: 'D_ball', value: 'Ø32 mm', note: 'Rotil Yatak Çapı' },
        { code: 't_rib', value: '6 mm', note: 'Kaburga (Rib) Et Kalınlığı' }
      ],
      material: 'Alüminyum Al-356-T6 Döküm (Sy = 185 MPa)',
      scale: '1:2 ISO-E',
      tolerance: 'ISO 8062 Döküm Toleransı',
      svgType: 'control_arm'
    },
    steps: [
      'Ankraj ve rotil bağlantı gözlerinin konumlarını sabit referans olarak çizin.',
      'Yük akış yollarını inceleyerek I-kesit veya kafes kaburga (Rib) yapısı kurgulayın.',
      'Düşük gerilme oluşan orta gövdeden topolojik ceb boşaltmaları yapın.',
      'Ankraj noktalarında et kalınlığını 10mm, orta kaburgalarda 6mm tutun.',
      'CAD statik analiz modülü ile 3000N yük altında gerilme ve sehim (displacement) kontrolü yapın.'
    ],
    exampleSolution: {
      title: 'MechStudio Optimize Süspansiyon Kolu Çözümü',
      material: 'Alüminyum Al-356-T6 Döküm',
      weight: '740 g',
      weightReduction: '%47 Kütle Tasarrufu (1.4kg -> 0.74kg)',
      safetyFactor: '1.85 (3000N altında)',
      maxStress: '100.2 MPa (Von Mises)',
      annotations: [
        {
          id: 'ann-c1',
          x: 45,
          y: 50,
          title: 'I-Kesit Kaburga Yapısı',
          description: 'Eğilme momentine karşı maksimum Atalet Momenti (I) sağlayan uçak/otomotiv döküm kaburga tasarımı.',
          tag: 'Geometri'
        },
        {
          id: 'ann-c2',
          x: 20,
          y: 35,
          title: 'Güçlendirilmiş Burç Yuvası',
          description: 'Süspansiyon burç çakma kuvvetine ve burulmaya dayanması için dairesel ek et kalınlığı.',
          tag: 'Yük Aktarımı'
        },
        {
          id: 'ann-c3',
          x: 75,
          y: 65,
          title: 'Rotil Bağlantı Cebi',
          description: 'Pahlı döküm geçişleri ile döküm içi gözenek ve boşluk gerilme yığılmaları engellendi.',
          tag: 'Döküm Uyumu'
        }
      ],
      criticalValues: [
        { label: 'Orijinal Çelik Kütle', standardValue: '1400 g', optimizedValue: '740 g', unit: 'g', isImportant: true },
        { label: 'Unsprung Kütle Etkisi', standardValue: 'Yüksek Titreşim', optimizedValue: 'Konforlu Yol Tutuş', isImportant: true },
        { label: 'Maks. Gerilme (Von Mises)', standardValue: '125 MPa', optimizedValue: '100.2 MPa', unit: 'MPa' },
        { label: 'Maksimum Sehim (Deformasyon)', standardValue: '1.2 mm', optimizedValue: '0.64 mm', unit: 'mm' }
      ],
      designDecisions: [
        {
          title: 'Yaylanmayan Kütle Optimizasyonu',
          explanation: 'Salıncak kolundan eksiltilen her 100 gram, araç dinamiğinde şasedeki 400 gramlık hafiflemeye denk konfor hissi yaratır.'
        },
        {
          title: 'FEA Yük Dağılımına Göre Et Kalınlığı Derecelendirmesi',
          explanation: 'Gerilmenin 20 MPa altına düştüğü nötr eksen bölgelerinde boşaltma pencereleri açıldı.'
        }
      ]
    },
    criteria: [
      { id: 'crit-c1', text: 'Salıncak kolu toplam kütlesi 850 gramın altına indirildi mi?', weight: 1 },
      { id: 'crit-c2', text: '3 ana bağlantı noktasının eksen mesafeleri tam korundu mu?', weight: 1 },
      { id: 'crit-c3', text: 'I-kesit veya destek kaburgaları (Ribs) eklendi mi?', weight: 1 },
      { id: 'crit-c4', text: '3000N dikey yük altında emniyet katsayısı S ≥ 1.5 sağlandı mı?', weight: 1 },
      { id: 'crit-c5', text: 'Tüm geçiş radüsleri döküm imalatına uygun (R ≥ 4mm) yapıldı mı?', weight: 1 }
    ]
  },
  {
    id: 'task-4',
    title: 'Flanşlı Boru Bağlantısı & Sızdırmazlık',
    shortDescription: 'Basınçlı kap ve buhar hatları için PN40 flanş ve sızdırmazlık contası cıvata hesabı.',
    difficulty: 'Orta',
    skillTags: ['CAD', 'Sızdırmazlık', 'Basınçlı Kap', 'Civata Hesabı'],
    estimatedTime: '75 dk',
    isPremium: true,
    status: 'locked',
    context: {
      useCase: 'Petrokimya, Doğalgaz ve Buhar Tesisat Hatları',
      realWorldExample: '40 bar yüksek basınçlı buhar hatlarında boru birleşim flanşları sıcaklık ve iç basınç altında sızdırma yapmamalıdır.',
      engineeringReason: 'Cıvata ön gerilme kuvveti (preload) iç basıncın flanş yüzeylerini ayırma kuvvetinden büyük olmalıdır. Aksi halde patlama ve tehlikeli gaz sızıntısı yaşanır.',
      criticalFactor: 'EN 1092-1 flanş standardı, conta basma gerilmesi ve cıvata daire çapı yerleşimi.'
    },
    brief: {
      scenario: '40 bar (4 MPa) iç basınca maruz kalacak DN80 boru hattı için PN40 standardında kaynak boyunlu flanş tasarla.',
      constraints: [
        '40 bar akışkan iç basıncı.',
        '8 adet M16 emniyet cıvatası yerleşimi.',
        'Grafit kaplamalı çelik conta kanalı yapısı.',
        'EN 1092-1 standart normuna tam uyum.'
      ],
      requiredOutput: 'Flanş 3D Modeli + Sızdırmazlık Yüzeyi Detay Resmı.',
      parameters: [
        { label: 'İç Basınç', value: '40 bar (4 MPa)' },
        { label: 'Boru Çapı', value: 'DN80 (88.9 mm)' },
        { label: 'Cıvata Sayısı', value: '8x M16' },
        { label: 'Standart', value: 'EN 1092-1 Type 11' }
      ]
    },
    drawing: {
      dimensions: [
        { code: 'D_ext', value: 'Ø200 mm', note: 'Dış Flanş Çapı' },
        { code: 'D_bolt', value: 'Ø160 mm', note: 'Cıvata Dairesi Çapı' },
        { code: 'D_int', value: 'Ø88.9 mm', note: 'İç Boru Çapı' },
        { code: 't_flange', value: '24 mm', note: 'Flanş Et Kalınlığı' }
      ],
      material: 'P250GH Basınçlı Kap Çeliği',
      scale: '1:1 ISO-E',
      tolerance: 'EN 1092-1 Standart Toleransı',
      svgType: 'flange'
    },
    steps: [
      'DN80 iç çap ve PN40 et kalınlığına göre profil çizin.',
      '8 adet M16 cıvata deliğini Ø160mm eksen dairesine eşit açıyla (45°) dizin.',
      'Sızdırmazlık contası için yükseltilmiş yüzey (Raised Face - RF) işleyin.',
      'Kaynak ağzı pahını (30° bevel) boru tarafına yerleştirin.'
    ],
    exampleSolution: {
      title: 'MechStudio PN40 Standart Flanş Çözümü',
      material: 'P250GH Kazan Çeliği',
      weight: '4.2 kg',
      weightReduction: 'Standart Uyumlu',
      safetyFactor: '3.1 (Cıvata Ön Gerilmesi)',
      maxStress: '120 MPa',
      annotations: [
        {
          id: 'ann-f1',
          x: 50,
          y: 50,
          title: 'Raised Face Sızdırmazlık Yüzeyi',
          description: 'Cıvata sıkıldığında contaya yüksek birim basınç uygulayan 2mm yüksekliğinde fatura.',
          tag: 'Sızdırmazlık'
        }
      ],
      criticalValues: [
        { label: 'Cıvata Sıkma Torku', standardValue: '90 Nm', optimizedValue: '135 Nm', unit: 'Nm', isImportant: true }
      ],
      designDecisions: [
        {
          title: 'Cıvata Ön Gerilme Hesabı',
          explanation: 'İç basıncın yarattığı eksenel açma kuvvetine karşı cıvatalara %70 akma dayanımında ön gerilme uygulandı.'
        }
      ]
    },
    criteria: [
      { id: 'crit-f1', text: '8 adet M16 cıvata deliği Ø160mm daireye 45° açıyla dizildi mi?', weight: 1 }
    ]
  },
  {
    id: 'task-5',
    title: 'Şanzıman Gövdesi Topoloji Optimizasyonu',
    shortDescription: 'Havacılık ve yarış araçları için aşırı tork yükü altındaki hafifletilmiş redüktör gövdesi.',
    difficulty: 'İleri',
    skillTags: ['CAD', 'FEA', 'Topoloji', 'Havacılık', 'Döküm'],
    estimatedTime: '120 dk',
    isPremium: true,
    status: 'locked',
    context: {
      useCase: 'Havacılık İHA ve Performans Şanzımanları',
      realWorldExample: 'İnsansız hava araçları ve helikopter dişli kutusu gövdeleri eksenel tork ve helis dişli itki kuvvetlerini minimum ağırlıkla taşımak zorundadır.',
      engineeringReason: 'Havacılıkta 1 kg kütle tasarrufu batarya/yakıt menzilinde kritik avantaj sağlar.',
      criticalFactor: 'Helis dişli eksenel itkisi (axial thrust) ve rulman yuvası ovalleşme rijitliği.'
    },
    brief: {
      scenario: '450 Nm tork aktaran helis dişli çiftini barındıran magnezyum-alüminyum döküm şanzıman gövdesini optimize et.',
      constraints: [
        '450 Nm sürekli reaksiyon torku.',
        'Maksimum gövde ağırlığı 1.2 kg.',
        'Rulman eksenleri arası sehim < 0.05 mm olmalı.'
      ],
      requiredOutput: 'Generative/Topolojik 3D CAD Modeli ve Modal Analiz Raporu.',
      parameters: [
        { label: 'Maks Tork', value: '450 Nm' },
        { label: 'Hedef Kütle', value: '< 1.2 kg' },
        { label: 'Eksen Sehimi', value: '< 0.05 mm' }
      ]
    },
    drawing: {
      dimensions: [
        { code: 'L_axis', value: '140 mm', note: 'Eksenler Arası Mesafe' },
        { code: 'D_brg1', value: 'Ø52 mm', note: 'Giriş Rulman Yuvası' },
        { code: 'D_brg2', value: 'Ø72 mm', note: 'Çıkış Rulman Yuvası' }
      ],
      material: 'Magnezyum-Alüminyum Alaşımı AZ91D',
      scale: '1:1 ISO-E',
      tolerance: 'ISO 2768-f (Hassas)',
      svgType: 'housing'
    },
    steps: [
      'Giriş ve çıkış mil rulman yataklarını 140mm eksen mesafesinde yerleştirin.',
      'Gövde cıvata bağlantı kulaklarını kurgulayın.',
      'FEA generatif tasarım simülasyonu ile yük akış organik kaburgalarını üretin.'
    ],
    exampleSolution: {
      title: 'MechStudio Generatif Havacılık Şanzımanı',
      material: 'AZ91D Magnezyum Alaşımı',
      weight: '980 g',
      weightReduction: '%52 Kütle Tasarrufu',
      safetyFactor: '2.4',
      maxStress: '140 MPa',
      annotations: [
        { id: 'ann-h1', x: 50, y: 50, title: 'Generatif Ağ Yapısı', description: 'Yük akışına paralel organik destek kolları.', tag: 'Topoloji' }
      ],
      criticalValues: [
        { label: 'Kütle', standardValue: '2100 g', optimizedValue: '980 g', unit: 'g', isImportant: true }
      ],
      designDecisions: [
        { title: 'Modal Frekans Uyumu', explanation: 'Gövde doğal frekansı dişli çark çalışma frekansının üstüne çıkarılarak rezonans engellendi.' }
      ]
    },
    criteria: [
      { id: 'crit-h1', text: 'Eksen mesafesi sehimi 0.05 mm altında tutuldu mu?', weight: 1 }
    ]
  },
  {
    id: 'task-6',
    title: 'Isı Değiştirici Kanatçık & Soğutma Bloğu',
    shortDescription: 'Güç elektroniği ve motor sürücüleri için doğal ve zorlamalı taşınım soğutucu tasarımı.',
    difficulty: 'İleri',
    skillTags: ['CAD', 'Termodinamik', 'Isı Transferi', 'Ekstrüzyon'],
    estimatedTime: '60 dk',
    isPremium: true,
    status: 'locked',
    context: {
      useCase: 'Elektrikli Araç Inverter & Güç Elektroniği Soğutması',
      realWorldExample: 'EV motor sürücülerinde IGBT MOSFET modülleri 150W/cm² mertebesinde yoğun ısı üretir.',
      engineeringReason: 'Sıcaklık 125°C üstüne çıkarsa yarı iletkenler yanar. Minimum hacimde maksimum ısı transfer yüzey alanı (A) yaratılmalıdır.',
      criticalFactor: 'Kanatçık (Fin) adımı, kalınlığı ve hava akış basınç düşümü (pressure drop).'
    },
    brief: {
      scenario: '200 W ısı yayan MOSFET güç bloğu için Alüminyum ekstrüzyon soğutucu blok tasarla.',
      constraints: [
        '200 W termal kayıp gücü.',
        'Maksimum yüzey sıcaklığı T_max < 75 °C.',
        'Alüminyum ekstrüzyon üretilebilirliği (Min fin kalınlığı 1.8 mm).'
      ],
      requiredOutput: 'Kanatçıklı 3D CAD Modeli ve Isıl Termal Dağılım Grafiği.',
      parameters: [
        { label: 'Isıl Yük', value: '200 W' },
        { label: 'Maks Sıcaklık', value: '< 75 °C' },
        { label: 'Kanat Sayısı', value: '14 x Fin' }
      ]
    },
    drawing: {
      dimensions: [
        { code: 'W x L', value: '120 x 100 mm', note: 'Taban Boyutu' },
        { code: 'H_fin', value: '45 mm', note: 'Kanat Yüksekliği' },
        { code: 't_base', value: '8 mm', note: 'Taban Kalınlığı' },
        { code: 't_fin', value: '2 mm', note: 'Kanatçık Kalınlığı' }
      ],
      material: 'Alüminyum 6063-T6 (Yüksek Isıl İletkenlik k=200 W/mK)',
      scale: '1:1 ISO-E',
      tolerance: 'DIN 17615 Ekstrüzyon',
      svgType: 'fin'
    },
    steps: [
      '120x100mm boyutlarında 8mm kalınlığında taban tabakası çizin.',
      'Üzerine 45mm yüksekliğinde 14 adet kanatçığı ekstrüze edin.',
      'Kanatçık diplerine ısı birikimini azaltmak için 0.8mm radüs verin.'
    ],
    exampleSolution: {
      title: 'MechStudio Termal Soğutucu Blok Çözümü',
      material: 'Alüminyum 6063-T6',
      weight: '410 g',
      weightReduction: 'Optimized Fin Area',
      safetyFactor: 'T_max 64.2 °C',
      maxStress: 'Termal Gerilme Emniyetli',
      annotations: [
        { id: 'ann-t1', x: 50, y: 30, title: 'Optimized Fin Spacing', description: 'Zorlamalı havada maksimum ısı taşınımı katsayısı h sağlayan kanat adımı.', tag: 'Termal' }
      ],
      criticalValues: [
        { label: 'Maks. Junction Temp', standardValue: '88 °C', optimizedValue: '64.2 °C', unit: '°C', isImportant: true }
      ],
      designDecisions: [
        { title: 'Taban Isı Yayılımı', explanation: 'MOSFET altındaki 8mm kalın taban ısının tüm kanatlara homojen yayılmasını sağlar.' }
      ]
    },
    criteria: [
      { id: 'crit-t1', text: '14 adet 2mm kalınlığında kanatçık eklendi mi?', weight: 1 }
    ]
  }
];

export const INITIAL_USER_PROFILE = {
  name: 'Ahmet Yılmaz',
  title: 'Makine Mühendisliği Öğrencisi (3. Sınıf)',
  university: 'İstanbul Teknik Üniversitesi (İTÜ)',
  grade: '3. Sınıf · Lisans',
  xp: 240,
  level: 3,
  completedTasksCount: 2,
  badges: [
    { name: 'CAD Modelleme Ustası', icon: 'Box', date: '02.08.2026' },
    { name: 'Teknik Resim Okuryazarı', icon: 'FileText', date: '04.08.2026' },
    { name: 'FEA Temelleri', icon: 'Activity', date: '07.08.2026' },
    { name: 'Sac Metal Tasarımı', icon: 'Layers', date: '08.08.2026' }
  ],
  isPro: false,
  freeTasksRemaining: 1
};
