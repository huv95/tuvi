/* ----------------------------------------------------
   DATA STRUCTURE FOR 14 MAIN STARS (CHÍNH TINH)
   ---------------------------------------------------- */
const starsData = [
    {
        id: 'tu-vi',
        name: 'Tử Vi',
        group: 'Tử Phủ Vũ Tướng Liêm',
        element: 'Dương Thổ',
        elementCategory: 'Thổ',
        essence: 'Đế Tinh (Lãnh Đạo, Tôn Quý)',
        bestPositions: ['Mệnh', 'Quan Lộc'],
        worstPositions: ['Huynh Đệ (Bào)', 'Phụ Mẫu', 'Tử Tức'],
        summary: 'Ngôi sao tôn quý nhất, thủ lãnh 14 chính tinh, đại diện cho uy quyền, khí chất minh quân và khả năng gánh vác trách nhiệm.',
        bestDetail: 'Khi thủ Mệnh hoặc Quan Lộc, Tử Vi phát huy tối đa khí chất "minh quân", có năng lực chỉ huy đắc lực, gánh vác trách nhiệm lớn và dễ đạt được danh vị cao.',
        worstDetail: 'Do bản chất Đế tinh mang cái tôi rất cao và sĩ diện, khi đóng ở các cung Lục thân dễ gây ra sự cô khắc, lấn át người thân, hoặc khiến đương số phải gánh vác trách nhiệm gia đình quá nặng nề dẫn đến mệt mỏi. Tại cung Bào, Tử Vi chủ về sự đơn độc, hình khắc.',
        keywords: ['Đế vương', 'Quyền lực', 'Lãnh đạo', 'Sĩ diện', 'Cô khắc Lục thân'],
        color: 'text-amber-400',
        borderBg: 'border-amber-500/30'
    },
    {
        id: 'thien-phu',
        name: 'Thiên Phủ',
        group: 'Tử Phủ Vũ Tướng Liêm',
        element: 'Âm Thổ',
        elementCategory: 'Thổ',
        essence: 'Phú Tinh, Lộc Khố (Kho Tiền Của Trời)',
        bestPositions: ['Tài Bạch', 'Điền Trạch'],
        worstPositions: ['Đồng cung Không vong (Địa Không, Địa Kiếp, Tuần, Triệt)'],
        summary: 'Kho báu trời ban, giữ vai trò tích lũy, bảo bọc, quản lý tài sản và xây dựng nền tảng tài chính bền vững.',
        bestDetail: 'Đóng tại Tài Bạch, Điền Trạch là đắc vị, ví như kho vàng bạc được cất giữ cẩn mật, chủ về điền sản dồi dào, tài chính tích lũy vững bền.',
        worstDetail: 'Thiên Phủ rất kỵ gặp các sao Không (Địa Không, Địa Kiếp, Tuần, Triệt). Khi gặp Không vong, kho tiền bị "thủng" thành "không khố" (kho rỗng), khiến đương số dễ lâm vào cảnh túng thiếu đột ngột, phá tán di sản tổ nghiệp.',
        keywords: ['Lộc khố', 'Tích lũy', 'An toàn', 'Kỵ Không Vong', 'Bền vững'],
        color: 'text-yellow-400',
        borderBg: 'border-yellow-500/30'
    },
    {
        id: 'vu-khuc',
        name: 'Vũ Khúc',
        group: 'Tử Phủ Vũ Tướng Liêm',
        element: 'Âm Kim',
        elementCategory: 'Kim',
        essence: 'Tài Tinh, Hóa khí Tù & Cô Độc',
        bestPositions: ['Tài Bạch'],
        worstPositions: ['Phu Thê', 'Tử Tức'],
        summary: 'Chính Tài tinh quả cảm, dứt khoát, giỏi kinh doanh nhưng mang thuộc tính Âm Kim thu liễm, dễ cô khắc gia đạo.',
        bestDetail: 'Đóng tại Tài Bạch giúp đương số có tư duy tài chính sắc bén, khả năng kinh doanh xuất sắc, dứt khoát và dòng tiền dồi dào.',
        worstDetail: 'Hóa khí của Vũ Khúc là "Tù" và "Cô độc" (Quả tú tinh). Ngũ hành Âm Kim mang tính chất thu liễm, lạnh lùng. Khi đóng ở cung Phu Thê hay Tử Tức, nó gây ra sự hình khắc mạnh mẽ, vợ chồng lãnh đạm, sinh ly tử biệt hoặc hiếm muộn con cái.',
        keywords: ['Chính tài', 'Quả cảm', 'Tư duy tài chính', 'Cô độc', 'Khắc Phu Thê'],
        color: 'text-slate-300',
        borderBg: 'border-slate-400/30'
    },
    {
        id: 'thien-tuong',
        name: 'Thiên Tướng',
        group: 'Tử Phủ Vũ Tướng Liêm',
        element: 'Dương Thủy',
        elementCategory: 'Thủy',
        essence: 'Ấn Tinh (Uy Tín, Danh Dự, Phò Tá)',
        bestPositions: ['Quan Lộc', 'Mệnh'],
        worstPositions: ['Cung gặp Tuần, Triệt', 'Phu Thê hãm địa'],
        summary: 'Biểu tượng của ấn tín, danh dự, lòng trắc ẩn và vai trò quân sư phò tá đắc lực.',
        bestDetail: 'Đóng tại Quan Lộc chủ về công danh an định, bình ổn, cực kỳ hợp với vai trò phò tá đắc lực (thư ký, tham mưu, phó phòng, trợ lý cao cấp).',
        worstDetail: 'Thiên Tướng tượng trưng cho khuôn mặt và danh dự. Nếu gặp Tuần, Triệt án ngữ, chủ về bị "mất mặt", gãy đổ công danh tai hại hoặc tàn tật. Đóng tại Phu Thê hãm địa chủ về sự lấn lướt bạn đời, gia đạo hay cãi vã.',
        keywords: ['Ấn tín', 'Uy tín', 'Phò tá', 'Kỵ Tuần Triệt', 'Danh dự'],
        color: 'text-blue-400',
        borderBg: 'border-blue-500/30'
    },
    {
        id: 'liem-trinh',
        name: 'Liêm Trinh',
        group: 'Tử Phủ Vũ Tướng Liêm',
        element: 'Âm Hỏa',
        elementCategory: 'Hỏa',
        essence: 'Tù Tinh, Đào Hoa Thứ (Kỷ Luật, Quan Tư Pháp)',
        bestPositions: ['Quan Lộc (tại Dần, Thân)'],
        worstPositions: ['Phu Thê', 'Tật Ách'],
        summary: 'Nghiêm nghị, kỷ luật, quản lý tư pháp. Bên trong dồn nén ngọn lửa Âm Hỏa dễ gây cuồng nhiệt hoặc xung đột nội tâm.',
        bestDetail: 'Khi đắc địa ở Quan Lộc (đặc biệt Dần, Thân), Liêm Trinh bộc lộ tính chất của một vị quan thanh liêm, giúp đương số thăng tiến nhanh, nắm giữ uy quyền lớn.',
        worstDetail: 'Liêm Trinh mang ngọn lửa Âm Hỏa dồn nén bên trong. Đóng tại Phu Thê chủ về sự ghen tuông khắc nghiệt, dễ gây hình khắc, ly hôn nhiều lần. Đóng tại Tật Ách dễ bộc phát các bệnh về máu mủ, tim mạch hoặc tai nạn mổ xẻ dữ dội.',
        keywords: ['Quan tư pháp', 'Kỷ luật', 'Ghen tuông', 'Bệnh máu mủ', 'Nghiêm nghị'],
        color: 'text-red-400',
        borderBg: 'border-red-500/30'
    },
    {
        id: 'that-sat',
        name: 'Thất Sát',
        group: 'Sát Phá Tham',
        element: 'Dương Kim',
        elementCategory: 'Kim',
        essence: 'Quyền Tinh, Tướng Tinh (Dũng Mãnh, Quyết Liệt)',
        bestPositions: ['Mệnh', 'Quan Lộc'],
        worstPositions: ['Huynh Đệ', 'Phụ Mẫu', 'Tử Tức', 'Phu Thê (Lục Thân)'],
        summary: 'Ngôi sao võ nghiệp dũng mãnh, dám đột phá và dấn thân, nhưng sát khí cực mạnh gây cô độc.',
        bestDetail: 'Đóng tại Mệnh hay Quan Lộc giúp đương số có tư duy độc lập, chịu được áp lực cực lớn, dám dấn thân và dễ lập chiến công lừng lẫy trong võ nghiệp hoặc kinh doanh mạo hiểm.',
        worstDetail: 'Do mang sát khí mạnh và tính chất cô độc, Thất Sát đóng ở các cung Lục thân như Phu Thê, Phụ Mẫu, Tử Tức chủ về sự hình khắc nặng nề, gia đình ly tán, khó tìm được sự nâng đỡ từ người thân.',
        keywords: ['Tướng tinh', 'Dũng mãnh', 'Sát khí', 'Chịu áp lực', 'Khắc Lục thân'],
        color: 'text-slate-200',
        borderBg: 'border-slate-300/30'
    },
    {
        id: 'pha-quan',
        name: 'Phá Quân',
        group: 'Sát Phá Tham',
        element: 'Dương Thủy',
        elementCategory: 'Thủy',
        essence: 'Hao Tinh (Tiên Phong, Đập Cũ Xây Mới)',
        bestPositions: ['Mệnh', 'Quan Lộc (tại Tý, Ngọ)'],
        worstPositions: ['Phu Thê', 'Tử Tức', 'Tài Bạch hãm địa'],
        summary: 'Sao tiên phong sẵn sàng phá bỏ quy tắc cũ để tái thiết cái mới, tính chất biến động và hao tán rất lớn.',
        bestDetail: 'Đắc địa tại Mệnh, Quan (đặc biệt tại Tý, Ngọ) giúp đương số có uy quyền hiển hách, tạo nên những bước ngoặt vĩ đại và mang tính cách mạng cho sự nghiệp.',
        worstDetail: 'Phá Quân là "Hao tinh" chủ về sự hao tán, biến động đột ngột. Đóng tại Phu Thê chủ sự hao tán phu thê, vợ chồng bất nghĩa phải chắp nối nhiều lần; đóng tại Tử Tức gây hiếm con, khó nuôi; đóng tại Tài Bạch hãm địa chủ về tiền bạc ra vào thất thường, dễ bị phá sản.',
        keywords: ['Đột phá', 'Hao tinh', 'Biến động', 'Chắp nối Phu Thê', 'Tiên phong'],
        color: 'text-cyan-400',
        borderBg: 'border-cyan-500/30'
    },
    {
        id: 'tham-lang',
        name: 'Tham Lang',
        group: 'Sát Phá Tham',
        element: 'Dương Thủy đới Kim',
        elementCategory: 'Thủy',
        essence: 'Đào Hoa Tinh, Dục Vọng Tinh (Giao Tiếp, Đa Tài)',
        bestPositions: ['Mệnh', 'Tài Bạch (gặp Hỏa/Linh tại Thìn Tuất Sửu Mùi)'],
        worstPositions: ['Phu Thê', 'Hãm địa tại Tỵ, Hợi'],
        summary: 'Khéo giao tiếp, đa tài, nhạy bén tài chính nhưng tham vọng lớn, kỵ lụy tửu sắc khi hãm địa.',
        bestDetail: 'Khi tọa Mệnh, Tài gặp Hỏa Tinh/Linh Tinh (cách Hỏa Tham, Linh Tham) chủ về sự hoạnh phát tài lộc rực rỡ, giàu sang tột bậc đột ngột.',
        worstDetail: 'Khi rơi vào vị trí hãm địa (Tỵ, Hợi) hoặc đóng ở cung Phu Thê, Tham Lang bộc lộ tính chất "Đào hoa lộ" dâm dật, chơi bời sa đọa, gây hình khắc gia đạo và lụy thân vì tửu sắc.',
        keywords: ['Đa tài', 'Hỏa Tham hoạnh phát', 'Khéo giao tiếp', 'Tửu sắc hãm', 'Dục vọng'],
        color: 'text-teal-300',
        borderBg: 'border-teal-400/30'
    },
    {
        id: 'thien-co',
        name: 'Thiên Cơ',
        group: 'Cơ Nguyệt Đồng Lương',
        element: 'Âm Mộc',
        elementCategory: 'Mộc',
        essence: 'Thiện Tinh, Mưu Trí (Bộ Não, Mưu Lược)',
        bestPositions: ['Mệnh', 'Quan Lộc', 'Phúc Đức'],
        worstPositions: ['Phu Thê', 'Điền Trạch hãm địa (như Dậu)'],
        summary: 'Trí tuệ, tư duy mưu lược, giỏi lên kế hoạch nhưng là Động tinh nên kỵ đóng ở các cung cần sự an định.',
        bestDetail: 'Đóng tại Mệnh, Quan, Phúc giúp đương số có trí tuệ siêu việt, giỏi lên kế hoạch, tham mưu, học vấn cao rộng và giỏi giải quyết vấn đề.',
        worstDetail: 'Thiên Cơ là một "Động tinh" uyển chuyển như dây leo Âm Mộc. Khi đóng ở Phu Thê dễ gây ra biến động lớn trong tình cảm, vợ chồng bất hòa. Đóng ở Điền Trạch hãm địa (như tại Dậu) dễ gây ra cảnh phá sản, lìa bỏ tổ nghiệp, nhà đất ít và phải chuyển nhà thường xuyên.',
        keywords: ['Bộ não', 'Mưu trí', 'Tham mưu', 'Động tinh', 'Khắc Điền/Thê hãm'],
        color: 'text-emerald-400',
        borderBg: 'border-emerald-500/30'
    },
    {
        id: 'thai-am',
        name: 'Thái Âm',
        group: 'Cơ Nguyệt Đồng Lương',
        element: 'Âm Thủy',
        elementCategory: 'Thủy',
        essence: 'Phú Tinh (Mặt Trăng, Tích Lũy, Nhu Hòa)',
        bestPositions: ['Điền Trạch', 'Tài Bạch'],
        worstPositions: ['Tật Ách', 'Hãm địa tại các cung ban ngày'],
        summary: 'Biểu tượng Mặt Trăng, dịu dàng, chủ về điền sản, tài sản tích lũy và trực giác tinh tế.',
        bestDetail: 'Đóng tại Điền, Tài sáng sủa giúp đương số có duyên lớn với điền sản, bất động sản nhiều và tích lũy được khối tài sản khổng lồ.',
        worstDetail: 'Thái Âm hãm địa đóng ở Tật Ách dễ gây ra các bệnh sinh lý nữ hoặc đau mắt. Nếu hãm địa thủ Mệnh, tính chất âm nhu quá mức khiến đương số dễ rơi vào đa sầu đa cảm, suy nghĩ tiêu cực, tự gây áp lực tinh thần cho bản thân.',
        keywords: ['Mặt Trăng', 'Bất động sản', 'Âm nhu', 'Đa sầu đa cảm', 'Đau mắt'],
        color: 'text-indigo-300',
        borderBg: 'border-indigo-400/30'
    },
    {
        id: 'thien-dong',
        name: 'Thiên Đồng',
        group: 'Cơ Nguyệt Đồng Lương',
        element: 'Dương Thủy',
        elementCategory: 'Thủy',
        essence: 'Phúc Tinh (An Nhàn, Hồn Nhiên, Cứu Giúp)',
        bestPositions: ['Mệnh', 'Phúc Đức'],
        worstPositions: ['Quan Lộc', 'Tài Bạch hãm địa'],
        summary: 'Đứa trẻ tâm hồn hồn nhiên, hay gặp may mắn hóa nguy thành an, nhưng thiếu tính kiên trì bứt phá.',
        bestDetail: 'Đóng tại Mệnh, Phúc giúp đương số có đời sống tinh thần an lạc, sống thọ, tấm lòng nhân hậu và luôn gặp hung hóa cát.',
        worstDetail: 'Thiên Đồng có nhược điểm là lười biếng, thiếu kiên nhẫn và dễ thỏa hiệp. Nếu đóng ở Quan, Tài hãm địa mà không được sát tinh kích phát, đương số sẽ thiếu ý chí tiến thủ, làm việc đầu voi đuôi chuột, tiền bạc túng thiếu và sự nghiệp trì trệ.',
        keywords: ['Phúc tinh', 'An nhàn', 'Thọ trường', 'Thiếu kiên nhẫn', 'Trì trệ Quan Tài'],
        color: 'text-sky-300',
        borderBg: 'border-sky-400/30'
    },
    {
        id: 'thien-luong',
        name: 'Thiên Lương',
        group: 'Cơ Nguyệt Đồng Lương',
        element: 'Dương Mộc',
        elementCategory: 'Mộc',
        essence: 'Thọ Tinh, Ấm Tinh (Che Chở, Người Thầy, Giải Tai)',
        bestPositions: ['Phụ Mẫu', 'Tật Ách', 'Mệnh'],
        worstPositions: ['Tử Tức', 'Phu Thê hãm địa'],
        summary: 'Bậc trưởng lão nhân từ, đệ nhất sao giải tai bệnh, cốt cách nhà giáo nhưng đôi khi nguyên tắc bảo thủ.',
        bestDetail: 'Đóng tại Phụ Mẫu giúp cha mẹ thọ trường, đóng tại Tật Ách là đệ nhất cứu giải giúp hóa giải mọi bệnh tật, tai ương nan y.',
        worstDetail: 'Bản chất của Thiên Lương mang tính chất "Trưởng lão" bảo thủ, thích giáo huấn người khác. Khi đóng ở Tử Tức hay Phu Thê hãm địa, tính chất này dễ gây ra sự cô đơn, xa cách về mặt tình cảm, vợ chồng hình khắc hoặc chậm con cái.',
        keywords: ['Ấm tinh', 'Giải tai ách', 'Trưởng lão', 'Bảo thủ', 'Xa cách Phu Thê'],
        color: 'text-amber-300',
        borderBg: 'border-amber-400/30'
    },
    {
        id: 'cu-mon',
        name: 'Cự Môn',
        group: 'Cự Nhật',
        element: 'Âm Thủy',
        elementCategory: 'Thủy',
        essence: 'Ám Tinh (Cánh Cửa Bị Che, Ngôn Ngữ, Khẩu Thị)',
        bestPositions: ['Quan Lộc', 'Điền Trạch'],
        worstPositions: ['Phu Thê', 'Phúc Đức', 'Phụ Mẫu'],
        summary: 'Ngôn ngữ sắc bén, tư duy phản biện xuất sắc nhưng hóa khí Ám kỵ các cung tình cảm gia đạo.',
        bestDetail: 'Đóng ở Quan Lộc đắc địa giúp đương số hiển đạt trong ngành tư pháp, thẩm phán, ngoại giao hay diễn thuyết. Đóng ở Điền Trạch mang tượng nhà cửa cao ráo, điền sản vượng.',
        worstDetail: 'Hóa khí của Cự Môn là "Ám" (che lấp ánh sáng) và chủ về thị phi. Khi đóng ở các cung tình cảm như Phu Thê, Phụ Mẫu, Phúc Đức, nó kích hoạt sự nghi ngờ, khắt khe, dễ gây ra tranh cãi khẩu thiệt, gia đạo lạnh nhạt, bất hòa và ly tán.',
        keywords: ['Ngoại giao', 'Khẩu tài', 'Hóa khí Ám', 'Tranh cãi', 'Thị phi gia đạo'],
        color: 'text-purple-300',
        borderBg: 'border-purple-400/30'
    },
    {
        id: 'thai-duong',
        name: 'Thái Dương',
        group: 'Cự Nhật',
        element: 'Dương Hỏa',
        elementCategory: 'Hỏa',
        essence: 'Quý Tinh (Mặt Trời, Quang Minh, Công Danh)',
        bestPositions: ['Quan Lộc', 'Mệnh (Sáng sủa ban ngày)'],
        worstPositions: ['Phu Thê hãm địa', 'Cung ban đêm (Thân đến Tý)'],
        summary: 'Biểu tượng Mặt Trời rực rỡ, rộng lượng, phụng sự và danh tiếng hiển hách khi đắc địa.',
        bestDetail: 'Đóng ở Mệnh, Quan đắc địa (sinh ban ngày, các cung từ Dần đến Ngọ) giúp đương số sớm thành đạt, công danh hiển hách, tâm hồn quang minh chính đại.',
        worstDetail: 'Thái Dương tượng trưng cho người cha, người chồng. Khi hãm địa đóng ở Phu Thê hoặc các cung ban đêm, nó chủ về sự lu mờ ánh sáng, gây bất lợi cực lớn cho nam giới trong nhà (cha/chồng dễ đoản thọ, yếu nhược), hoặc khiến đương số dễ thu hút thị phi, bôi nhọ danh dự.',
        keywords: ['Mặt Trời', 'Công danh', 'Bất lợi Nam giới hãm', 'Quang minh', 'Tỏa sáng'],
        color: 'text-orange-400',
        borderBg: 'border-orange-500/30'
    }
];

/* ----------------------------------------------------
   DATA STRUCTURE FOR 12 PALACES (CUNG CHỨC NĂNG)
   ---------------------------------------------------- */
const palacesData = [
    { id: 'menh', name: 'Mệnh', desc: 'Tinh thần cốt lõi, khí chất, tính cách và định hướng vận mệnh cả đời.' },
    { id: 'quan-loc', name: 'Quan Lộc', desc: 'Công danh, sự nghiệp, môi trường làm việc và năng lực quản lý.' },
    { id: 'tai-bach', name: 'Tài Bạch', desc: 'Tư duy tài chính, khả năng kiếm tiền, dòng tiền và quản lý của cải.' },
    { id: 'dien-trach', name: 'Điền Trạch', desc: 'Bất động sản, điền sản, nhà cửa, gia phong và tích lũy gia sản.' },
    { id: 'phu-the', name: 'Phu Thê', desc: 'Tình cảm lứa đôi, mối quan hệ vợ chồng, hôn nhân và gia đạo.' },
    { id: 'luc-than', name: 'Lục Thân (Bào, Phụ, Tử)', desc: 'Mối quan hệ với cha mẹ, anh chị em và con cái trong gia đình.' },
    { id: 'tat-ach', name: 'Tật Ách', desc: 'Sức khỏe, bệnh tật nội tạng, tai ương nguy hiểm và khả năng cứu giải.' },
    { id: 'phuc-duc', name: 'Phúc Đức', desc: 'Tâm tính, tư tưởng, phúc đức tổ tiên, tuổi thọ và sự an lạc.' }
];

/* ----------------------------------------------------
   DATA STRUCTURE FOR QUIZ QUESTIONS
   ---------------------------------------------------- */
const quizQuestions = [
    {
        q: "Chính tinh nào được mệnh danh là 'Lộc khố' (kho tiền của trời) và rất kỵ gặp các sao Không (Địa Không, Địa Kiếp, Tuần, Triệt)?",
        options: ["Tử Vi", "Thiên Phủ", "Vũ Khúc", "Thái Âm"],
        answer: 1,
        explain: "Thiên Phủ là Lộc Khố. Khi gặp Không Vong sẽ bị thủng kho thành 'Không khố', gây túng thiếu đột ngột."
    },
    {
        q: "Vũ Khúc có hóa khí là 'Tù' và 'Cô độc' (Âm Kim), ngôi sao này xấu nhất khi tọa thủ tại các cung nào?",
        options: ["Quan Lộc & Tài Bạch", "Mệnh & Thân", "Phu Thê & Tử Tức", "Điền Trạch & Tật Ách"],
        answer: 2,
        explain: "Tính thu liễm lạnh lùng của Âm Kim làm Vũ Khúc kỵ nhất đóng tại Phu Thê hoặc Tử Tức, chủ về hình khắc và đơn độc."
    },
    {
        q: "Tại sao Tử Vi – ngôi sao tôn quý nhất – lại được cho là xấu nhất khi đóng ở các cung Lục Thân (Bào, Phụ, Tử)?",
        options: [
            "Vì Tử Vi không có năng lực lãnh đạo",
            "Do bản chất Đế Tinh cái tôi cao, sĩ diện, lấn át người thân hoặc gánh nặng quá lớn",
            "Vì Tử Vi thuộc hành Dương Thủy gây ngập lụt",
            "Vì Tử Vi luôn biến thành hao tinh ở Lục thân"
        ],
        answer: 1,
        explain: "Tử Vi là Đế Tinh có khí chất lấn át và cái tôi lớn, đóng ở Lục Thân gây cô khắc, đơn độc hoặc gánh vác trách nhiệm gia đình quá mệt mỏi."
    },
    {
        q: "Tham Lang đạt cách cục hoạnh phát tài lộc rực rỡ nhất khi tọa thủ Mệnh/Tài Bạch hội cùng các sao nào tại Thìn Tuất Sửu Mùi?",
        options: ["Tuần, Triệt", "Địa Không, Địa Kiếp", "Hỏa Tinh hoặc Linh Tinh", "Kình Dương, Đà La"],
        answer: 2,
        explain: "Tham Lang gặp Hỏa Tinh hoặc Linh Tinh tạo thành cách cục 'Hỏa Tham' hoặc 'Linh Tham' hoạnh phát tài lộc rực rỡ."
    },
    {
        q: "Cự Môn mang hóa khí là gì và kỵ nhất khi đóng ở nhóm cung nào?",
        options: [
            "Hóa khí 'Ấn', kỵ Quan Lộc",
            "Hóa khí 'Tù', kỵ Tật Ách",
            "Hóa khí 'Ám' (thị phi), kỵ Phu Thê, Phúc Đức, Phụ Mẫu",
            "Hóa khí 'Phúc', kỵ Điền Trạch"
        ],
        answer: 2,
        explain: "Cự Môn là Ám Tinh, chủ về che lấp và thị phi. Đóng ở các cung tình cảm gia đạo dễ gây ngờ vực, tranh cãi và ly tán."
    }
];
