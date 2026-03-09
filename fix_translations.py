import json

en_desc = {
  "cappadociaDesc": "Immerse yourself in the magic of Cappadocia with our premium transfer service. Arrive in unparalleled comfort to begin enjoying the breathtaking landscapes.",
  "pamukkaleDesc": "Experience the natural wonder of Pamukkale's thermal pools. Our luxury transfer ensures a relaxing journey to this unique destination.",
  "fethiyeDesc": "Discover the stunning turquoise coast of Fethiye. Travel in absolute style and comfort with our executive transfer vehicles.",
  "istanbulDesc": "Explore the vibrant crossroads of Europe and Asia. Our VIP transfer provides seamless navigation through Istanbul's historic and modern wonders.",
  "alanyaDesc": "Relax on the beautiful Mediterranean shores of Alanya. Start your vacation perfectly with our smooth and comfortable transfer service.",
  "bodrumDesc": "Experience the luxury and charm of Bodrum. Arrive elegantly at your resort or yacht with our premium chauffeur service.",
  "kemerDesc": "Enjoy the spectacular scenery of Kemer's coastline and mountains. Our premium transfer guarantees a comfortable start to your coastal retreat."
}

ru_desc = {
  "cappadociaDesc": "Погрузитесь в магию Каппадокии с нашим премиальным сервисом. Прибудьте с непревзойденным комфортом, чтобы сразу начать наслаждаться пейзажами.",
  "pamukkaleDesc": "Откройте для себя природное чудо термальных источников Памуккале. Наш роскошный трансфер обеспечит спокойную поездку.",
  "fethiyeDesc": "Откройте потрясающее бирюзовое побережье Фетхие. Путешествуйте с абсолютным стилем и комфортом на наших представительских авто.",
  "istanbulDesc": "Исследуйте яркий перекресток Европы и Азии. Наш VIP-трансфер обеспечит безупречное передвижение по историческому Стамбулу.",
  "alanyaDesc": "Расслабьтесь на прекрасных средиземноморских берегах Алании. Начните свой отпуск идеально с нашего комфортного трансфера.",
  "bodrumDesc": "Почувствуйте роскошь и очарование Бодрума. Прибудьте элегантно на свой курорт с нашим премиальным сервисом.",
  "kemerDesc": "Насладитесь захватывающими дух пейзажами Кемера. Наш премиальный трансфер гарантирует комфортное начало вашего отдыха."
}

tr_desc = {
  "cappadociaDesc": "Kapadokya'nın büyüsüne premium transfer hizmetimizle dalın. Nefes kesici manzaraların tadını çıkarmak için eşsiz bir konforla varın.",
  "pamukkaleDesc": "Pamukkale'nin termal havuzlarının doğal harikasını deneyimleyin. Lüks transferimiz bu eşsiz noktaya rahat bir yolculuk sağlar.",
  "fethiyeDesc": "Fethiye'nin çarpıcı turkuaz kıyılarını keşfedin. Executive transfer araçlarımızla mutlak stil ve konfor içinde seyahat edin.",
  "istanbulDesc": "Avrupa ve Asya'nın canlı kavşağını keşfedin. VIP transferimiz, İstanbul'un tarihi ve modern harikaları arasında kusursuz bir geçiş sağlar.",
  "alanyaDesc": "Alanya'nın güzel Akdeniz kıyılarında rahatlayın. Sorunsuz ve konforlu transfer hizmetimizle tatilinize mükemmel bir başlangıç yapın.",
  "bodrumDesc": "Bodrum'un lüksünü ve cazibesini deneyimleyin. Premium şoför hizmetimizle tatil köyünüze veya yatınıza zarif bir şekilde varın.",
  "kemerDesc": "Kemer'in sahil şeridi ve dağlarının muhteşem manzarasının keyfini çıkarın. Premium transferimiz konforlu bir başlangıcı garanti eder."
}

de_desc = {
  "cappadociaDesc": "Tauchen Sie mit unserem Premium-Transfer-Service in die Magie Kappadokiens ein. Kommen Sie in unvergleichlichem Komfort an.",
  "pamukkaleDesc": "Erleben Sie das Naturwunder der Thermalbäder von Pamukkale. Unser Luxustransfer sorgt für eine entspannte Reise zu diesem einzigartigen Ziel.",
  "fethiyeDesc": "Entdecken Sie die atemberaubende türkisfarbene Küste von Fethiye. Reisen Sie mit absolutem Stil und Komfort.",
  "istanbulDesc": "Erkunden Sie den pulsierenden Knotenpunkt zwischen Europa und Asien. Unser VIP-Transfer bietet nahtlose Navigation durch Istanbul.",
  "alanyaDesc": "Entspannen Sie sich an den wunderschönen Mittelmeerküsten von Alanya. Beginnen Sie Ihren Urlaub perfekt mit unserem reibungslosen Transfer.",
  "bodrumDesc": "Erleben Sie den Luxus und Charme von Bodrum. Kommen Sie elegant in Ihrem Resort mit unserem Premium-Chauffeurservice an.",
  "kemerDesc": "Genießen Sie die spektakuläre Landschaft von Kemer. Unser Premium-Transfer garantiert einen komfortablen Start."
}

btn_text = {
    "en": "Book transfer to",
    "ru": "Забронировать трансфер в",
    "tr": "Transfer rezervasyonu yap:",
    "de": "Transfer buchen nach"
}

files = [
    ('messages/en.json', en_desc, btn_text['en']),
    ('messages/ru.json', ru_desc, btn_text['ru']),
    ('messages/tr.json', tr_desc, btn_text['tr']),
    ('messages/de.json', de_desc, btn_text['de']),
]

for file, desc, btn in files:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'Destinations' in data and 'Cards' in data['Destinations']:
        data['Destinations']['Cards'].update(desc)
        data['Destinations']['Cards']['bookTransfer'] = btn

        # Ensure cities exist
        cities = ["cappadocia", "pamukkale", "fethiye", "istanbul", "alanya", "bodrum", "kemer"]
        for c in cities:
            if c not in data['Destinations']['Cards']:
                data['Destinations']['Cards'][c] = c.capitalize()

    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated modal descriptions and button text in i18n files.")
