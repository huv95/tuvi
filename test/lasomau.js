// ============================================================================
// 11 lá số chuẩn lấy từ tuvivietnam.vn, dùng làm dữ liệu đối chiếu cho an sao.
//
// Độ phủ: 10/10 Thiên Can · 5/5 Ngũ Hành Cục · 4/4 Âm Dương Nam Nữ
//         tháng thường lẫn tháng nhuận · 5 giờ sinh · Mệnh ở 5 vị trí khác nhau
//
// Mỗi cung ghi: cung (tên cung chức) · dh (đại hạn) · th (tiểu hạn)
//               ts (vòng Trường Sinh) · chinh (chính tinh, đúng thứ tự)
//               hoa (Tứ Hóa) · phu (phụ tinh, không kể thứ tự)
// "L.X" = sao lưu niên theo năm xem hạn.
// ============================================================================

export default [
{
  label: '#1  Ất Hợi 1995 · Âm Nam · Hỏa lục cục',
  birth: { name:'#1', gender:1, isSolar:true, day:17, month:3, year:1995, hour:4, minute:30, viewYear:2026, isLeapMonth:false },
  info:  { lunar:'Ngày 17/2/1995 (Thường)', cc:'Ất Hợi - Kỷ Mão - Đinh Mùi - Nhâm Dần', nap:'Sơn Đầu Hỏa',
           cuc:'Hỏa Lục Cục', ts:'Mệnh Cục Bình Hòa', adnn:'Âm Nam', thuanLy:true, mc:'Cự Môn', tc:'Thiên Cơ', than:'Quan Lộc' },
  P: {
   'Tỵ':  {cung:'Quan Lộc',than:1,dh:86,th:'Mão',ts:'Tuyệt',chinh:['Thiên Tướng'],phu:['Tả Phụ','Bát Tọa','Thiên Mã','L.Lộc Tồn','Phục Binh','Tuế Phá','Thiên Hư']},
   'Ngọ': {cung:'Nô Bộc',dh:76,th:'Thìn',ts:'Mộ',chinh:['Thiên Lương'],hoa:{'Thiên Lương':'Quyền'},phu:['Văn Khúc','Lưu Niên Văn Tinh','Thiên Trù','Long Đức','Đại Hao','Thiên Thương','L.Thái Tuế','L.Kình Dương']},
   'Mùi': {cung:'Thiên Di',dh:66,th:'Tỵ',ts:'Tử',chinh:['Liêm Trinh','Thất Sát'],phu:['Hoa Cái','Hỏa Tinh','Bệnh Phù','Bạch Hổ','Thiên Khốc']},
   'Thân':{cung:'Tật Ách',dh:56,th:'Ngọ',ts:'Bệnh',chinh:[],phu:['Văn Xương','Thiên Việt','Địa Giải','Thai Phụ','Hỉ Thần','Đường Phù','Thiên Phúc','Phúc Đức','Thiên Đức','L.Thiên Mã','Kiếp Sát','Thiên Sứ','L.Tang Môn']},
   'Thìn':{cung:'Điền Trạch',dh:96,th:'Dần',ts:'Thai',chinh:['Cự Môn'],phu:['Hồng Loan','Phong Cáo','Thiên Quan','Nguyệt Đức','Thiên Thọ','Kình Dương','Quan Phù','Tử Phù','Thiên La','L.Đà La']},
   'Dậu': {cung:'Tài Bạch',dh:46,th:'Mùi',ts:'Suy',chinh:[],phu:['Hữu Bật','Thiên Giải','Tam Thai','Địa Không','Phi Liêm','Điếu Khách','Phá Toái']},
   'Mão': {cung:'Phúc Đức',dh:106,th:'Sửu',ts:'Dưỡng',chinh:['Tử Vi','Tham Lang'],hoa:{'Tử Vi':'Khoa'},phu:['Lộc Tồn','Thiên Quý','Bác Sĩ','Long Trì','Quan Phù']},
   'Tuất':{cung:'Tử Tức',dh:36,th:'Thân',ts:'Đế Vượng',chinh:['Thiên Đồng'],phu:['Thiên Hỷ','Tấu Thư','Thiên Hình','Quả Tú','Lưu Hà','Trực Phù','Địa Võng']},
   'Dần': {cung:'Phụ Mẫu',dh:116,th:'Tý',ts:'Trường Sinh',chinh:['Thiên Cơ','Thái Âm'],hoa:{'Thiên Cơ':'Lộc','Thái Âm':'Kỵ'},phu:['Thiên Y','Lực Sĩ','Thiếu Âm','Đà La','Thiên Diêu','Cô Thần','L.Bạch Hổ']},
   'Sửu': {cung:'Mệnh',menh:1,dh:6,th:'Hợi',ts:'Mộc Dục',chinh:['Thiên Phủ'],phu:['Thanh Long','Địa Kiếp','Tang Môn']},
   'Tý':  {cung:'Huynh Đệ',dh:16,th:'Tuất',ts:'Quan Đới',chinh:['Thái Dương'],phu:['Thiên Khôi','Đào Hoa','Thiếu Dương','Thiên Tài','Linh Tinh','Thiên Không','Tiểu Hao','Đẩu Quân','L.Thiên Khốc','L.Thiên Hư']},
   'Hợi': {cung:'Phu Thê',dh:26,th:'Dậu',ts:'Lâm Quan',chinh:['Vũ Khúc','Phá Quân'],phu:['Quốc Ấn','Tướng Quân','Giải Thần','Ân Quang','Phượng Các','Thái Tuế']},
  }
},
{
  label: '#2  Tân Mùi 1991 · Âm Nữ · Kim tứ cục',
  birth: { name:'#2', gender:2, isSolar:true, day:4, month:11, year:1991, hour:5, minute:30, viewYear:2026, isLeapMonth:false },
  info:  { lunar:'Ngày 28/9/1991 (Thường)', cc:'Tân Mùi - Mậu Tuất - Mậu Dần - Ất Mão', nap:'Lộ Bàng Thổ',
           cuc:'Kim Tứ Cục', ts:'Mệnh Sinh Cục', adnn:'Âm Nữ', thuanLy:true, mc:'Vũ Khúc', tc:'Thiên Tướng', than:'Thiên Di' },
  P: {
   'Tỵ':  {cung:'Phu Thê',dh:104,th:'Mão',ts:'Trường Sinh',chinh:['Thái Dương'],hoa:{'Thái Dương':'Quyền'},phu:['Phong Cáo','Thiên Quý','Quốc Ấn','Thiên Phúc','Thiên Mã','L.Lộc Tồn','Thiên Hình','Bệnh Phù','Điếu Khách']},
   'Ngọ': {cung:'Huynh Đệ',dh:114,th:'Dần',ts:'Mộc Dục',chinh:['Phá Quân'],phu:['Thiên Việt','Thiên Trù','Đại Hao','Trực Phù','L.Thái Tuế','L.Kình Dương']},
   'Mùi': {cung:'Mệnh',menh:1,dh:4,th:'Sửu',ts:'Quan Đới',chinh:['Thiên Cơ'],hoa:{'Văn Khúc':'Khoa','Văn Xương':'Kỵ'},phu:['Văn Khúc','Văn Xương','Hoa Cái','Linh Tinh','Phục Binh','Thái Tuế']},
   'Thân':{cung:'Phụ Mẫu',dh:14,th:'Tý',ts:'Lâm Quan',chinh:['Tử Vi','Thiên Phủ'],phu:['Hồng Loan','Thiếu Dương','Thiên Thọ','L.Thiên Mã','Địa Không','Đà La','Thiên Không','Cô Thần','Quan Phù','Kiếp Sát','L.Tang Môn']},
   'Thìn':{cung:'Tử Tức',dh:94,th:'Thìn',ts:'Dưỡng',chinh:['Vũ Khúc'],phu:['Thiên Giải','Hỉ Thần','Phúc Đức','Thiên Đức','Quả Tú','Thiên La','L.Đà La']},
   'Dậu': {cung:'Phúc Đức',dh:24,th:'Hợi',ts:'Đế Vượng',chinh:['Thái Âm'],phu:['Lộc Tồn','Thiên Y','Thai Phụ','Ân Quang','Bác Sĩ','Thiên Quan','Thiên Diêu','Tang Môn']},
   'Mão': {cung:'Tài Bạch',dh:84,th:'Tỵ',ts:'Thai',chinh:['Thiên Đồng'],phu:['Địa Giải','Tam Thai','Giải Thần','Phượng Các','Phi Liêm','Lưu Hà','Bạch Hổ']},
   'Tuất':{cung:'Điền Trạch',dh:34,th:'Tuất',ts:'Suy',chinh:['Tham Lang'],phu:['Lực Sĩ','Thiếu Âm','Kình Dương','Địa Võng']},
   'Dần': {cung:'Tật Ách',dh:74,th:'Ngọ',ts:'Tuyệt',chinh:['Thất Sát'],phu:['Hữu Bật','Thiên Khôi','Thiên Hỷ','Tấu Thư','Đường Phù','Long Đức','Thiên Tài','Địa Kiếp','Đẩu Quân','Thiên Sứ','L.Bạch Hổ']},
   'Sửu': {cung:'Thiên Di',than:1,dh:64,th:'Mùi',ts:'Mộ',chinh:['Thiên Lương'],phu:['Tướng Quân','Tuế Phá','Phá Toái','Thiên Hư']},
   'Tý':  {cung:'Nô Bộc',dh:54,th:'Thân',ts:'Tử',chinh:['Liêm Trinh','Thiên Tướng'],phu:['Tả Phụ','Đào Hoa','Lưu Niên Văn Tinh','Nguyệt Đức','Hỏa Tinh','Tiểu Hao','Tử Phù','Thiên Thương','L.Thiên Khốc','L.Thiên Hư']},
   'Hợi': {cung:'Quan Lộc',dh:44,th:'Dậu',ts:'Bệnh',chinh:['Cự Môn'],hoa:{'Cự Môn':'Lộc'},phu:['Bát Tọa','Thanh Long','Long Trì','Quan Phù','Thiên Khốc']},
  }
},
{
  label: '#3  Canh Ngọ 1990 · Dương Nữ · Hỏa lục cục',
  birth: { name:'#3', gender:2, isSolar:true, day:11, month:3, year:1990, hour:4, minute:30, viewYear:2026, isLeapMonth:false },
  info:  { lunar:'Ngày 15/2/1990 (Thường)', cc:'Canh Ngọ - Kỷ Mão - Ất Hợi - Mậu Dần', nap:'Lộ Bàng Thổ',
           cuc:'Hỏa Lục Cục', ts:'Cục Sinh Mệnh', adnn:'Dương Nữ', thuanLy:false, mc:'Cự Môn', tc:'Hỏa Tinh', than:'Quan Lộc' },
  P: {
   'Tỵ':  {cung:'Quan Lộc',than:1,dh:86,th:'Tỵ',ts:'Tuyệt',chinh:['Liêm Trinh','Tham Lang'],phu:['Tả Phụ','Thiên Quý','L.Lộc Tồn','Linh Tinh','Tiểu Hao','Trực Phù','Phá Toái']},
   'Ngọ': {cung:'Nô Bộc',dh:76,th:'Thìn',ts:'Mộ',chinh:['Cự Môn'],phu:['Văn Khúc','Thiên Việt','Thanh Long','Thiên Phúc','Thái Tuế','Thiên Thương','L.Thái Tuế','L.Kình Dương']},
   'Mùi': {cung:'Thiên Di',dh:66,th:'Mão',ts:'Tử',chinh:['Thiên Tướng'],phu:['Tam Thai','Bát Tọa','Lực Sĩ','Thiếu Dương','Thiên Tài','Đà La','Thiên Không','Đẩu Quân']},
   'Thân':{cung:'Tật Ách',dh:56,th:'Dần',ts:'Bệnh',chinh:['Thiên Đồng','Thiên Lương'],hoa:{'Thiên Đồng':'Kỵ'},phu:['Văn Xương','Lộc Tồn','Địa Giải','Thai Phụ','Bác Sĩ','Thiên Mã','L.Thiên Mã','Cô Thần','Tang Môn','Thiên Sứ','L.Tang Môn']},
   'Thìn':{cung:'Điền Trạch',dh:96,th:'Ngọ',ts:'Thai',chinh:['Thái Âm'],hoa:{'Thái Âm':'Khoa'},phu:['Phong Cáo','Quốc Ấn','Giải Thần','Phượng Các','Quả Tú','Tướng Quân','Lưu Hà','Điếu Khách','Thiên La','L.Đà La']},
   'Dậu': {cung:'Tài Bạch',dh:46,th:'Sửu',ts:'Suy',chinh:['Vũ Khúc','Thất Sát'],hoa:{'Vũ Khúc':'Quyền'},phu:['Hữu Bật','Hồng Loan','Thiên Giải','Ân Quang','Thiếu Âm','Địa Không','Kình Dương','Quan Phù']},
   'Mão': {cung:'Phúc Đức',dh:106,th:'Mùi',ts:'Dưỡng',chinh:['Thiên Phủ'],phu:['Thiên Hỷ','Đào Hoa','Tấu Thư','Phúc Đức','Thiên Đức']},
   'Tuất':{cung:'Tử Tức',dh:36,th:'Tý',ts:'Đế Vượng',chinh:['Thái Dương'],hoa:{'Thái Dương':'Lộc'},phu:['Hoa Cái','Long Trì','Thiên Hình','Phục Binh','Quan Phù','Địa Võng']},
   'Dần': {cung:'Phụ Mẫu',dh:116,th:'Thân',ts:'Trường Sinh',chinh:[],phu:['Thiên Khôi','Thiên Y','Thiên Trù','Thiên Diêu','Phi Liêm','Bạch Hổ','L.Bạch Hổ']},
   'Sửu': {cung:'Mệnh',menh:1,dh:6,th:'Dậu',ts:'Mộc Dục',chinh:['Tử Vi','Phá Quân'],phu:['Hỉ Thần','Đường Phù','Long Đức','Địa Kiếp']},
   'Tý':  {cung:'Huynh Đệ',dh:16,th:'Tuất',ts:'Quan Đới',chinh:['Thiên Cơ'],phu:['Bệnh Phù','Tuế Phá','Thiên Hư','Thiên Khốc','L.Thiên Khốc','L.Thiên Hư']},
   'Hợi': {cung:'Phu Thê',dh:26,th:'Hợi',ts:'Lâm Quan',chinh:[],phu:['Lưu Niên Văn Tinh','Thiên Quan','Nguyệt Đức','Thiên Thọ','Hỏa Tinh','Đại Hao','Tử Phù','Kiếp Sát']},
  }
},
{
  label: '#4  Nhâm Ngọ 2002 · Dương Nam · Kim tứ cục',
  birth: { name:'#4', gender:1, isSolar:true, day:23, month:2, year:2002, hour:7, minute:30, viewYear:2026, isLeapMonth:false },
  info:  { lunar:'Ngày 12/1/2002 (Thường)', cc:'Nhâm Ngọ - Nhâm Dần - Nhâm Tuất - Giáp Thìn', nap:'Dương Liễu Mộc',
           cuc:'Kim Tứ Cục', ts:'Cục Khắc Mệnh', adnn:'Dương Nam', thuanLy:true, mc:'Lộc Tồn', tc:'Hỏa Tinh', than:'Tài Bạch' },
  P: {
   'Tỵ':  {cung:'Tật Ách',dh:74,th:'Mùi',ts:'Trường Sinh',chinh:['Thiên Lương'],hoa:{'Thiên Lương':'Lộc'},phu:['Thiên Việt','L.Lộc Tồn','Hỏa Tinh','Phi Liêm','Trực Phù','Phá Toái','Thiên Sứ']},
   'Ngọ': {cung:'Tài Bạch',than:1,dh:84,th:'Thân',ts:'Mộc Dục',chinh:['Thất Sát'],phu:['Văn Xương','Phong Cáo','Hỉ Thần','Thiên Phúc','Thái Tuế','L.Thái Tuế','L.Kình Dương']},
   'Mùi': {cung:'Tử Tức',dh:94,th:'Dậu',ts:'Quan Đới',chinh:[],phu:['Địa Giải','Quốc Ấn','Thiếu Dương','Địa Không','Thiên Không','Bệnh Phù']},
   'Thân':{cung:'Phu Thê',dh:104,th:'Tuất',ts:'Lâm Quan',chinh:['Liêm Trinh'],phu:['Văn Khúc','Thiên Giải','Thiên Mã','L.Thiên Mã','Cô Thần','Đại Hao','Tang Môn','L.Tang Môn']},
   'Thìn':{cung:'Thiên Di',dh:64,th:'Ngọ',ts:'Dưỡng',chinh:['Tử Vi','Thiên Tướng'],hoa:{'Tử Vi':'Quyền','Tả Phụ':'Khoa'},phu:['Tả Phụ','Ân Quang','Tấu Thư','Đường Phù','Thiên Tài','Giải Thần','Phượng Các','Quả Tú','Điếu Khách','Thiên La','L.Đà La']},
   'Dậu': {cung:'Huynh Đệ',dh:114,th:'Hợi',ts:'Đế Vượng',chinh:[],phu:['Hồng Loan','Thiên Trù','Thiếu Âm','Thiên Hình','Phục Binh']},
   'Mão': {cung:'Nô Bộc',dh:54,th:'Tỵ',ts:'Thai',chinh:['Thiên Cơ','Cự Môn'],phu:['Thiên Khôi','Thiên Hỷ','Đào Hoa','Tam Thai','Phúc Đức','Thiên Đức','Địa Kiếp','Tướng Quân','Thiên Thương']},
   'Tuất':{cung:'Mệnh',menh:1,dh:4,th:'Tý',ts:'Suy',chinh:['Phá Quân'],phu:['Hữu Bật','Thai Phụ','Thiên Quý','Thiên Quan','Hoa Cái','Long Trì','Đà La','Quan Phù','Đẩu Quân','Địa Võng']},
   'Dần': {cung:'Quan Lộc',dh:44,th:'Thìn',ts:'Tuyệt',chinh:['Tham Lang'],phu:['Lưu Niên Văn Tinh','Tiểu Hao','Bạch Hổ','L.Bạch Hổ']},
   'Sửu': {cung:'Điền Trạch',dh:34,th:'Mão',ts:'Mộ',chinh:['Thái Dương','Thái Âm'],phu:['Thiên Y','Thanh Long','Long Đức','Thiên Diêu']},
   'Tý':  {cung:'Phúc Đức',dh:24,th:'Dần',ts:'Tử',chinh:['Vũ Khúc','Thiên Phủ'],hoa:{'Vũ Khúc':'Kỵ'},phu:['Lực Sĩ','Thiên Thọ','Kình Dương','Tuế Phá','Thiên Hư','Thiên Khốc','L.Thiên Khốc','L.Thiên Hư']},
   'Hợi': {cung:'Phụ Mẫu',dh:14,th:'Sửu',ts:'Bệnh',chinh:['Thiên Đồng'],phu:['Lộc Tồn','Bát Tọa','Bác Sĩ','Nguyệt Đức','Linh Tinh','Lưu Hà','Tử Phù','Kiếp Sát']},
  }
},
{
  label: '#5  Bính Tý 1996 · Dương Nữ · Thổ ngũ cục',
  birth: { name:'#5', gender:2, isSolar:true, day:11, month:3, year:1996, hour:4, minute:30, viewYear:2026, isLeapMonth:false },
  info:  { lunar:'Ngày 22/1/1996 (Thường)', cc:'Bính Tý - Canh Dần - Đinh Mùi - Nhâm Dần', nap:'Giản Hạ Thủy',
           cuc:'Thổ Ngũ Cục', ts:'Cục Khắc Mệnh', adnn:'Dương Nữ', thuanLy:true, mc:'Tham Lang', tc:'Linh Tinh', than:'Quan Lộc' },
  P: {
   'Tỵ':  {cung:'Nô Bộc',dh:75,th:'Tỵ',ts:'Lâm Quan',chinh:['Thiên Tướng'],phu:['Lộc Tồn','Thiên Quan','Nguyệt Đức','L.Lộc Tồn','Bác Sĩ','Tử Phù','Kiếp Sát','Phá Toái','Thiên Thương']},
   'Ngọ': {cung:'Thiên Di',dh:65,th:'Thìn',ts:'Quan Đới',chinh:['Thiên Lương'],phu:['Văn Khúc','Kình Dương','Quan Phù','Tuế Phá','Thiên Hư','Thiên Khốc','L.Thái Tuế','L.Kình Dương']},
   'Mùi': {cung:'Tật Ách',dh:55,th:'Mão',ts:'Mộc Dục',chinh:['Liêm Trinh','Thất Sát'],hoa:{'Liêm Trinh':'Kỵ'},phu:['Địa Giải','Long Đức','Phục Binh','Lưu Hà','Thiên Sứ']},
   'Thân':{cung:'Tài Bạch',dh:45,th:'Dần',ts:'Trường Sinh',chinh:[],hoa:{'Văn Xương':'Khoa'},phu:['Văn Xương','Thiên Giải','Thai Phụ','Lưu Niên Văn Tinh','L.Thiên Mã','Đại Hao','Bạch Hổ','L.Tang Môn']},
   'Thìn':{cung:'Quan Lộc',than:1,dh:85,th:'Ngọ',ts:'Đế Vượng',chinh:['Cự Môn'],phu:['Tả Phụ','Phong Cáo','Ân Quang','Lực Sĩ','Hoa Cái','Thiên Thọ','Long Trì','Đà La','Quan Phù','Thiên La','L.Đà La']},
   'Dậu': {cung:'Tử Tức',dh:35,th:'Sửu',ts:'Dưỡng',chinh:[],phu:['Thiên Việt','Thiên Hỷ','Đào Hoa','Phúc Đức','Thiên Đức','Địa Không','Thiên Hình','Bệnh Phù']},
   'Mão': {cung:'Điền Trạch',dh:95,th:'Mùi',ts:'Suy',chinh:['Tử Vi','Tham Lang'],phu:['Hồng Loan','Thanh Long','Thiếu Âm']},
   'Tuất':{cung:'Phu Thê',dh:25,th:'Tý',ts:'Thai',chinh:['Thiên Đồng'],hoa:{'Thiên Đồng':'Lộc'},phu:['Hữu Bật','Thiên Quý','Hỉ Thần','Đường Phù','Giải Thần','Phượng Các','Quả Tú','Điếu Khách','Địa Võng']},
   'Dần': {cung:'Phúc Đức',dh:105,th:'Thân',ts:'Bệnh',chinh:['Thiên Cơ','Thái Âm'],hoa:{'Thiên Cơ':'Quyền'},phu:['Thiên Mã','Cô Thần','Tiểu Hao','Tang Môn','Đẩu Quân','L.Bạch Hổ']},
   'Sửu': {cung:'Phụ Mẫu',dh:115,th:'Dậu',ts:'Tử',chinh:['Thiên Phủ'],phu:['Thiên Y','Tam Thai','Bát Tọa','Quốc Ấn','Thiếu Dương','Địa Kiếp','Thiên Không','Thiên Diêu','Tướng Quân']},
   'Tý':  {cung:'Mệnh',menh:1,dh:5,th:'Tuất',ts:'Mộ',chinh:['Thái Dương'],phu:['Tấu Thư','Thiên Trù','Thiên Phúc','Thiên Tài','Hỏa Tinh','Linh Tinh','Thái Tuế','L.Thiên Khốc','L.Thiên Hư']},
   'Hợi': {cung:'Huynh Đệ',dh:15,th:'Hợi',ts:'Tuyệt',chinh:['Vũ Khúc','Phá Quân'],phu:['Thiên Khôi','Phi Liêm','Trực Phù']},
  }
},
{
  label: '#6  Giáp Tuất 1994 · Dương Nữ · Thủy nhị cục',
  birth: { name:'#6', gender:2, isSolar:true, day:11, month:3, year:1994, hour:4, minute:30, viewYear:2026, isLeapMonth:false },
  info:  { lunar:'Ngày 30/1/1994 (Thường)', cc:'Giáp Tuất - Bính Dần - Bính Thân - Canh Dần', nap:'Sơn Đầu Hỏa',
           cuc:'Thủy Nhị Cục', ts:'Cục Khắc Mệnh', adnn:'Dương Nữ', thuanLy:true, mc:'Tham Lang', tc:'Văn Xương', than:'Quan Lộc' },
  P: {
   'Tỵ':  {cung:'Nô Bộc',dh:72,th:'Dậu',ts:'Lâm Quan',chinh:['Thiên Lương'],phu:['Hồng Loan','Bát Tọa','Lưu Niên Văn Tinh','Thiên Trù','Long Đức','L.Lộc Tồn','Linh Tinh','Đại Hao','Thiên Thương']},
   'Ngọ': {cung:'Thiên Di',dh:62,th:'Thân',ts:'Quan Đới',chinh:['Thất Sát'],phu:['Văn Khúc','Bệnh Phù','Bạch Hổ','L.Thái Tuế','L.Kình Dương']},
   'Mùi': {cung:'Tật Ách',dh:52,th:'Mùi',ts:'Mộc Dục',chinh:[],phu:['Thiên Việt','Địa Giải','Hỉ Thần','Đường Phù','Thiên Quan','Phúc Đức','Thiên Đức','Quả Tú','Thiên Sứ']},
   'Thân':{cung:'Tài Bạch',dh:42,th:'Ngọ',ts:'Trường Sinh',chinh:['Liêm Trinh'],hoa:{'Liêm Trinh':'Lộc'},phu:['Văn Xương','Thiên Giải','Thai Phụ','Thiên Mã','L.Thiên Mã','Phi Liêm','Điếu Khách','Thiên Khốc','L.Tang Môn']},
   'Thìn':{cung:'Quan Lộc',than:1,dh:82,th:'Tuất',ts:'Đế Vượng',chinh:['Tử Vi','Thiên Tướng'],phu:['Tả Phụ','Phong Cáo','Phục Binh','Tuế Phá','Thiên Hư','Thiên La','L.Đà La']},
   'Dậu': {cung:'Tử Tức',dh:32,th:'Tỵ',ts:'Dưỡng',chinh:[],phu:['Tam Thai','Tấu Thư','Thiên Phúc','Địa Không','Thiên Hình','Lưu Hà','Trực Phù']},
   'Mão': {cung:'Điền Trạch',dh:92,th:'Hợi',ts:'Suy',chinh:['Thiên Cơ','Cự Môn'],phu:['Đào Hoa','Nguyệt Đức','Kình Dương','Quan Phù','Tử Phù']},
   'Tuất':{cung:'Phu Thê',dh:22,th:'Thìn',ts:'Thai',chinh:['Phá Quân'],hoa:{'Phá Quân':'Quyền'},phu:['Hữu Bật','Quốc Ấn','Hoa Cái','Thiên Tài','Tướng Quân','Thái Tuế','Địa Võng']},
   'Dần': {cung:'Phúc Đức',dh:102,th:'Tý',ts:'Bệnh',chinh:['Tham Lang'],phu:['Lộc Tồn','Thiên Quý','Bác Sĩ','Thiên Thọ','Long Trì','Quan Phù','L.Bạch Hổ']},
   'Sửu': {cung:'Phụ Mẫu',dh:112,th:'Sửu',ts:'Tử',chinh:['Thái Dương','Thái Âm'],hoa:{'Thái Dương':'Kỵ'},phu:['Thiên Khôi','Thiên Y','Lực Sĩ','Thiếu Âm','Địa Kiếp','Đà La','Thiên Diêu','Phá Toái']},
   'Tý':  {cung:'Mệnh',menh:1,dh:2,th:'Dần',ts:'Mộ',chinh:['Vũ Khúc','Thiên Phủ'],hoa:{'Vũ Khúc':'Khoa'},phu:['Ân Quang','Thanh Long','Giải Thần','Phượng Các','Tang Môn','Đẩu Quân','L.Thiên Khốc','L.Thiên Hư']},
   'Hợi': {cung:'Huynh Đệ',dh:12,th:'Mão',ts:'Tuyệt',chinh:['Thiên Đồng'],phu:['Thiên Hỷ','Thiếu Dương','Hỏa Tinh','Thiên Không','Cô Thần','Tiểu Hao','Kiếp Sát']},
  }
},
{
  label: '#7  Quý Dậu 1993 · Âm Nam · Thủy nhị cục',
  birth: { name:'#7', gender:1, isSolar:true, day:3, month:12, year:1993, hour:18, minute:30, viewYear:2026, isLeapMonth:false },
  info:  { lunar:'Ngày 20/10/1993 (Thường)', cc:'Quý Dậu - Quý Hợi - Mậu Ngọ - Tân Dậu', nap:'Kiếm Phong Kim',
           cuc:'Thủy Nhị Cục', ts:'Mệnh Sinh Cục', adnn:'Âm Nam', thuanLy:false, mc:'Lộc Tồn', tc:'Thiên Đồng', than:'Thiên Di' },
  P: {
   'Tỵ':  {cung:'Điền Trạch',dh:92,th:'Mùi',ts:'Lâm Quan',chinh:['Thiên Phủ'],phu:['Thiên Việt','Thiên Giải','Hỉ Thần','Đường Phù','Thiên Phúc','Thiên Thọ','L.Lộc Tồn','Bạch Hổ','Phá Toái']},
   'Ngọ': {cung:'Quan Lộc',dh:82,th:'Thân',ts:'Quan Đới',chinh:['Thiên Đồng','Thái Âm'],hoa:{'Thái Âm':'Khoa'},phu:['Hồng Loan','Đào Hoa','Bát Tọa','Thiên Quan','Phúc Đức','Thiên Đức','Hỏa Tinh','Thiên Hình','Phi Liêm','L.Thái Tuế','L.Kình Dương']},
   'Mùi': {cung:'Nô Bộc',dh:72,th:'Dậu',ts:'Mộc Dục',chinh:['Vũ Khúc','Tham Lang'],hoa:{'Tham Lang':'Kỵ'},phu:['Ân Quang','Thiên Quý','Tấu Thư','Linh Tinh','Quả Tú','Điếu Khách','Thiên Thương']},
   'Thân':{cung:'Thiên Di',than:1,dh:62,th:'Tuất',ts:'Trường Sinh',chinh:['Thái Dương','Cự Môn'],hoa:{'Cự Môn':'Quyền'},phu:['Tam Thai','Quốc Ấn','L.Thiên Mã','Địa Kiếp','Tướng Quân','Trực Phù','L.Tang Môn']},
   'Thìn':{cung:'Phúc Đức',dh:102,th:'Ngọ',ts:'Đế Vượng',chinh:[],phu:['Địa Giải','Long Đức','Bệnh Phù','Thiên La','L.Đà La']},
   'Dậu': {cung:'Tật Ách',dh:52,th:'Hợi',ts:'Dưỡng',chinh:['Thiên Tướng'],phu:['Tiểu Hao','Thái Tuế','Thiên Khốc','Đẩu Quân','Thiên Sứ']},
   'Mão': {cung:'Phụ Mẫu',dh:112,th:'Tỵ',ts:'Suy',chinh:['Liêm Trinh','Phá Quân'],hoa:{'Phá Quân':'Lộc'},phu:['Thiên Khôi','Thai Phụ','Lưu Niên Văn Tinh','Đại Hao','Tuế Phá','Thiên Hư']},
   'Tuất':{cung:'Tài Bạch',dh:42,th:'Tý',ts:'Thai',chinh:['Thiên Cơ','Thiên Lương'],phu:['Thiên Y','Thanh Long','Thiên Trù','Thiếu Dương','Thiên Không','Thiên Diêu','Địa Võng']},
   'Dần': {cung:'Mệnh',menh:1,dh:2,th:'Thìn',ts:'Bệnh',chinh:[],phu:['Nguyệt Đức','Địa Không','Phục Binh','Lưu Hà','Tử Phù','Kiếp Sát','L.Bạch Hổ']},
   'Sửu': {cung:'Huynh Đệ',dh:12,th:'Mão',ts:'Tử',chinh:[],phu:['Hữu Bật','Văn Khúc','Văn Xương','Tả Phụ','Hoa Cái','Giải Thần','Long Trì','Phượng Các','Kình Dương','Quan Phù']},
   'Tý':  {cung:'Phu Thê',dh:22,th:'Dần',ts:'Mộ',chinh:[],phu:['Lộc Tồn','Thiên Hỷ','Bác Sĩ','Thiếu Âm','L.Thiên Khốc','L.Thiên Hư']},
   'Hợi': {cung:'Tử Tức',dh:32,th:'Sửu',ts:'Tuyệt',chinh:['Tử Vi','Thất Sát'],phu:['Phong Cáo','Lực Sĩ','Thiên Mã','Thiên Tài','Đà La','Cô Thần','Tang Môn']},
  }
},
{
  label: '#8  Kỷ Tỵ 1989 · Âm Nữ · Thủy nhị cục',
  birth: { name:'#8', gender:2, isSolar:true, day:11, month:3, year:1989, hour:4, minute:30, viewYear:2026, isLeapMonth:false },
  info:  { lunar:'Ngày 4/2/1989 (Thường)', cc:'Kỷ Tỵ - Đinh Mão - Canh Ngọ - Mậu Dần', nap:'Đại Lâm Mộc',
           cuc:'Thủy Nhị Cục', ts:'Cục Sinh Mệnh', adnn:'Âm Nữ', thuanLy:true, mc:'Cự Môn', tc:'Thiên Cơ', than:'Quan Lộc' },
  P: {
   'Tỵ':  {cung:'Quan Lộc',than:1,dh:42,th:'Mùi',ts:'Tuyệt',chinh:['Thiên Tướng'],phu:['Tả Phụ','Giải Thần','Phượng Các','L.Lộc Tồn','Hỏa Tinh','Đà La','Quan Phù','Thái Tuế']},
   'Ngọ': {cung:'Nô Bộc',dh:52,th:'Ngọ',ts:'Thai',chinh:['Thiên Lương'],hoa:{'Thiên Lương':'Khoa','Văn Khúc':'Kỵ'},phu:['Văn Khúc','Lộc Tồn','Đào Hoa','Bát Tọa','Bác Sĩ','Thiếu Dương','Thiên Tài','Thiên Không','Lưu Hà','Đẩu Quân','Thiên Thương','L.Thái Tuế','L.Kình Dương']},
   'Mùi': {cung:'Thiên Di',dh:62,th:'Tỵ',ts:'Dưỡng',chinh:['Liêm Trinh','Thất Sát'],phu:['Lực Sĩ','Kình Dương','Tang Môn']},
   'Thân':{cung:'Tật Ách',dh:72,th:'Thìn',ts:'Trường Sinh',chinh:[],phu:['Văn Xương','Thiên Việt','Địa Giải','Thai Phụ','Tam Thai','Thanh Long','Thiên Trù','Thiếu Âm','L.Thiên Mã','Linh Tinh','Cô Thần','Thiên Sứ','L.Tang Môn']},
   'Thìn':{cung:'Điền Trạch',dh:32,th:'Thân',ts:'Mộ',chinh:['Cự Môn'],phu:['Thiên Hỷ','Phong Cáo','Thiên Quý','Quả Tú','Phục Binh','Trực Phù','Thiên La','L.Đà La']},
   'Dậu': {cung:'Tài Bạch',dh:82,th:'Mão',ts:'Mộc Dục',chinh:[],phu:['Hữu Bật','Thiên Giải','Lưu Niên Văn Tinh','Thiên Quan','Long Trì','Địa Không','Tiểu Hao','Quan Phù','Phá Toái']},
   'Mão': {cung:'Phúc Đức',dh:22,th:'Dậu',ts:'Tử',chinh:['Tử Vi','Tham Lang'],hoa:{'Tham Lang':'Quyền'},phu:['Đại Hao','Điếu Khách']},
   'Tuất':{cung:'Tử Tức',dh:92,th:'Dần',ts:'Quan Đới',chinh:['Thiên Đồng'],phu:['Hồng Loan','Ân Quang','Nguyệt Đức','Thiên Thọ','Thiên Hình','Tướng Quân','Tử Phù','Địa Võng']},
   'Dần': {cung:'Phụ Mẫu',dh:12,th:'Tuất',ts:'Bệnh',chinh:['Thiên Cơ','Thái Âm'],phu:['Thiên Y','Quốc Ấn','Thiên Phúc','Phúc Đức','Thiên Đức','Thiên Diêu','Bệnh Phù','Kiếp Sát','L.Bạch Hổ']},
   'Sửu': {cung:'Mệnh',menh:1,dh:2,th:'Hợi',ts:'Suy',chinh:['Thiên Phủ'],phu:['Hỉ Thần','Hoa Cái','Địa Kiếp','Bạch Hổ','Thiên Khốc']},
   'Tý':  {cung:'Huynh Đệ',dh:112,th:'Tý',ts:'Đế Vượng',chinh:['Thái Dương'],phu:['Thiên Khôi','Long Đức','Phi Liêm','L.Thiên Khốc','L.Thiên Hư']},
   'Hợi': {cung:'Phu Thê',dh:102,th:'Sửu',ts:'Lâm Quan',chinh:['Vũ Khúc','Phá Quân'],hoa:{'Vũ Khúc':'Lộc'},phu:['Tấu Thư','Đường Phù','Thiên Mã','Tuế Phá','Thiên Hư']},
  }
},
{
  label: '#9  Mậu Dần 1998 · Dương Nam · Thủy nhị cục',
  birth: { name:'#9', gender:1, isSolar:true, day:24, month:12, year:1998, hour:17, minute:30, viewYear:2026, isLeapMonth:false },
  info:  { lunar:'Ngày 6/11/1998 (Thường)', cc:'Mậu Dần - Giáp Tý - Ất Tỵ - Ất Dậu', nap:'Thành Đầu Thổ',
           cuc:'Thủy Nhị Cục', ts:'Mệnh Khắc Cục', adnn:'Dương Nam', thuanLy:false, mc:'Văn Khúc', tc:'Thiên Lương', than:'Thiên Di' },
  P: {
   'Tỵ':  {cung:'Phúc Đức',dh:22,th:'Mão',ts:'Tuyệt',chinh:['Thiên Lương'],phu:['Lộc Tồn','Địa Giải','Ân Quang','Bác Sĩ','Thiếu Âm','Thiên Tài','L.Lộc Tồn','Cô Thần','Lưu Hà']},
   'Ngọ': {cung:'Điền Trạch',dh:32,th:'Thìn',ts:'Thai',chinh:['Thất Sát'],phu:['Thiên Giải','Lực Sĩ','Thiên Trù','Long Trì','Linh Tinh','Kình Dương','Quan Phù','L.Thái Tuế','L.Kình Dương']},
   'Mùi': {cung:'Quan Lộc',dh:42,th:'Tỵ',ts:'Dưỡng',chinh:[],phu:['Thiên Việt','Thiên Hỷ','Tam Thai','Bát Tọa','Thanh Long','Nguyệt Đức','Thiên Hình','Tử Phù']},
   'Thân':{cung:'Nô Bộc',dh:52,th:'Ngọ',ts:'Trường Sinh',chinh:['Liêm Trinh'],phu:['Lưu Niên Văn Tinh','Giải Thần','Phượng Các','Thiên Mã','L.Thiên Mã','Địa Kiếp','Tiểu Hao','Tuế Phá','Thiên Hư','Thiên Thương','L.Tang Môn']},
   'Thìn':{cung:'Phụ Mẫu',dh:12,th:'Dần',ts:'Mộ',chinh:['Tử Vi','Thiên Tướng'],phu:['Đà La','Quan Phù','Tang Môn','Thiên Khốc','Thiên La','L.Đà La']},
   'Dậu': {cung:'Thiên Di',than:1,dh:62,th:'Mùi',ts:'Mộc Dục',chinh:[],phu:['Thiên Quý','Long Đức','Tướng Quân','Phá Toái']},
   'Mão': {cung:'Mệnh',menh:1,dh:2,th:'Sửu',ts:'Tử',chinh:['Thiên Cơ','Cự Môn'],hoa:{'Thiên Cơ':'Kỵ'},phu:['Đào Hoa','Thai Phụ','Thiên Quan','Thiên Phúc','Thiếu Dương','Thiên Không','Phục Binh']},
   'Tuất':{cung:'Tật Ách',dh:72,th:'Thân',ts:'Quan Đới',chinh:['Phá Quân'],phu:['Tấu Thư','Đường Phù','Hoa Cái','Hỏa Tinh','Bạch Hổ','Địa Võng','Thiên Sứ']},
   'Dần': {cung:'Huynh Đệ',dh:112,th:'Tý',ts:'Bệnh',chinh:['Tham Lang'],hoa:{'Tham Lang':'Lộc'},phu:['Tả Phụ','Địa Không','Đại Hao','Thái Tuế','L.Bạch Hổ']},
   'Sửu': {cung:'Phu Thê',dh:102,th:'Hợi',ts:'Suy',chinh:['Thái Dương','Thái Âm'],hoa:{'Thái Âm':'Quyền'},phu:['Văn Khúc','Văn Xương','Thiên Khôi','Hồng Loan','Quốc Ấn','Quả Tú','Bệnh Phù','Trực Phù','Đẩu Quân']},
   'Tý':  {cung:'Tử Tức',dh:92,th:'Tuất',ts:'Đế Vượng',chinh:['Vũ Khúc','Thiên Phủ'],hoa:{'Hữu Bật':'Khoa'},phu:['Hữu Bật','Hỉ Thần','Điếu Khách','L.Thiên Khốc','L.Thiên Hư']},
   'Hợi': {cung:'Tài Bạch',dh:82,th:'Dậu',ts:'Lâm Quan',chinh:['Thiên Đồng'],phu:['Thiên Y','Phong Cáo','Phúc Đức','Thiên Đức','Thiên Thọ','Thiên Diêu','Phi Liêm','Kiếp Sát']},
  }
},
{
  label: '#10 Đinh Sửu 1997 · Âm Nam · Kim tứ cục',
  birth: { name:'#10', gender:1, isSolar:true, day:24, month:12, year:1997, hour:17, minute:30, viewYear:2026, isLeapMonth:false },
  info:  { lunar:'Ngày 25/11/1997 (Thường)', cc:'Đinh Sửu - Nhâm Tý - Canh Tý - Ất Dậu', nap:'Giản Hạ Thủy',
           cuc:'Kim Tứ Cục', ts:'Cục Sinh Mệnh', adnn:'Âm Nam', thuanLy:true, mc:'Văn Khúc', tc:'Thiên Tướng', than:'Thiên Di' },
  P: {
   'Tỵ':  {cung:'Phúc Đức',dh:104,th:'Hợi',ts:'Trường Sinh',chinh:['Tử Vi','Thất Sát'],phu:['Địa Giải','Lực Sĩ','Thiên Trù','Long Trì','L.Lộc Tồn','Đà La','Quan Phù','Thiên Khốc']},
   'Ngọ': {cung:'Điền Trạch',dh:94,th:'Tý',ts:'Dưỡng',chinh:[],phu:['Lộc Tồn','Đào Hoa','Thiên Giải','Bác Sĩ','Nguyệt Đức','Hỏa Tinh','Tử Phù','L.Thái Tuế','L.Kình Dương']},
   'Mùi': {cung:'Quan Lộc',dh:84,th:'Sửu',ts:'Thai',chinh:[],phu:['Linh Tinh','Kình Dương','Thiên Hình','Quan Phù','Tuế Phá','Thiên Hư']},
   'Thân':{cung:'Nô Bộc',dh:74,th:'Dần',ts:'Tuyệt',chinh:[],phu:['Thiên Hỷ','Long Đức','L.Thiên Mã','Địa Kiếp','Phục Binh','Lưu Hà','Thiên Thương','L.Tang Môn']},
   'Thìn':{cung:'Phụ Mẫu',dh:114,th:'Tuất',ts:'Mộc Dục',chinh:['Thiên Cơ','Thiên Lương'],hoa:{'Thiên Cơ':'Khoa'},phu:['Thanh Long','Thiếu Âm','Thiên Tài','Thiên La','L.Đà La']},
   'Dậu': {cung:'Thiên Di',than:1,dh:64,th:'Mão',ts:'Mộ',chinh:['Liêm Trinh','Phá Quân'],phu:['Thiên Việt','Lưu Niên Văn Tinh','Giải Thần','Phượng Các','Đại Hao','Bạch Hổ']},
   'Mão': {cung:'Mệnh',menh:1,dh:4,th:'Dậu',ts:'Quan Đới',chinh:['Thiên Tướng'],phu:['Thai Phụ','Tiểu Hao','Tang Môn']},
   'Tuất':{cung:'Tật Ách',dh:54,th:'Thìn',ts:'Tử',chinh:[],phu:['Phúc Đức','Thiên Đức','Thiên Thọ','Bệnh Phù','Quả Tú','Địa Võng','Thiên Sứ']},
   'Dần': {cung:'Huynh Đệ',dh:14,th:'Thân',ts:'Lâm Quan',chinh:['Thái Dương','Cự Môn'],hoa:{'Cự Môn':'Kỵ'},phu:['Tả Phụ','Hồng Loan','Tam Thai','Thiên Quý','Quốc Ấn','Thiên Quan','Thiếu Dương','Địa Không','Thiên Không','Cô Thần','Tướng Quân','Kiếp Sát','L.Bạch Hổ']},
   'Sửu': {cung:'Phu Thê',dh:24,th:'Mùi',ts:'Đế Vượng',chinh:['Vũ Khúc','Tham Lang'],phu:['Văn Khúc','Văn Xương','Tấu Thư','Hoa Cái','Thái Tuế','Phá Toái']},
   'Tý':  {cung:'Tử Tức',dh:34,th:'Ngọ',ts:'Suy',chinh:['Thiên Đồng','Thái Âm'],hoa:{'Thái Âm':'Lộc','Thiên Đồng':'Quyền'},phu:['Hữu Bật','Bát Tọa','Ân Quang','Phi Liêm','Trực Phù','Đẩu Quân','L.Thiên Khốc','L.Thiên Hư']},
   'Hợi': {cung:'Tài Bạch',dh:44,th:'Tỵ',ts:'Bệnh',chinh:['Thiên Phủ'],phu:['Thiên Khôi','Thiên Y','Phong Cáo','Hỉ Thần','Đường Phù','Thiên Phúc','Thiên Mã','Thiên Diêu','Điếu Khách']},
  }
},
{
  label: '#11 Nhâm Tuất 1982 · Dương Nữ · Mộc tam cục · THÁNG NHUẬN',
  birth: { name:'#11', gender:2, isSolar:true, day:6, month:6, year:1982, hour:9, minute:30, viewYear:2026, isLeapMonth:false },
  info:  { lunar:'Ngày 15/4/1982 (Nhuận)', cc:'Nhâm Tuất - Ất Tỵ - Canh Thân - Tân Tỵ', nap:'Đại Hải Thủy',
           cuc:'Mộc Tam Cục', ts:'Mệnh Sinh Cục', adnn:'Dương Nữ', thuanLy:true, mc:'Tham Lang', tc:'Văn Xương', than:'Phu Thê' },
  P: {
   'Tỵ':  {cung:'Nô Bộc',dh:73,th:'Dậu',ts:'Bệnh',chinh:['Thiên Cơ'],phu:['Văn Xương','Thiên Việt','Hồng Loan','Bát Tọa','Long Đức','L.Lộc Tồn','Phi Liêm','Thiên Thương']},
   'Ngọ': {cung:'Thiên Di',dh:63,th:'Thân',ts:'Suy',chinh:['Tử Vi'],hoa:{'Tử Vi':'Quyền'},phu:['Ân Quang','Tấu Thư','Thiên Phúc','Địa Không','Bạch Hổ','L.Thái Tuế','L.Kình Dương']},
   'Mùi': {cung:'Tật Ách',dh:53,th:'Mùi',ts:'Đế Vượng',chinh:[],hoa:{'Tả Phụ':'Khoa'},phu:['Hữu Bật','Tả Phụ','Phong Cáo','Quốc Ấn','Phúc Đức','Thiên Đức','Quả Tú','Tướng Quân','Thiên Sứ']},
   'Thân':{cung:'Tài Bạch',dh:43,th:'Ngọ',ts:'Lâm Quan',chinh:['Phá Quân'],phu:['Thiên Quý','Thiên Mã','Thiên Thọ','L.Thiên Mã','Hỏa Tinh','Linh Tinh','Tiểu Hao','Điếu Khách','Thiên Khốc','L.Tang Môn']},
   'Thìn':{cung:'Quan Lộc',dh:83,th:'Tuất',ts:'Tử',chinh:['Thất Sát'],phu:['Thiên Y','Hỉ Thần','Đường Phù','Địa Kiếp','Thiên Diêu','Tuế Phá','Thiên Hư','Thiên La','L.Đà La']},
   'Dậu': {cung:'Tử Tức',dh:33,th:'Tỵ',ts:'Quan Đới',chinh:[],phu:['Văn Khúc','Tam Thai','Thanh Long','Thiên Trù','Trực Phù']},
   'Mão': {cung:'Điền Trạch',dh:93,th:'Hợi',ts:'Mộ',chinh:['Thái Dương','Thiên Lương'],hoa:{'Thiên Lương':'Lộc'},phu:['Thiên Khôi','Đào Hoa','Nguyệt Đức','Bệnh Phù','Tử Phù']},
   'Tuất':{cung:'Phu Thê',than:1,dh:23,th:'Thìn',ts:'Mộc Dục',chinh:['Liêm Trinh','Thiên Phủ'],phu:['Địa Giải','Lực Sĩ','Thiên Quan','Hoa Cái','Thiên Tài','Đà La','Thái Tuế','Địa Võng']},
   'Dần': {cung:'Phúc Đức',dh:103,th:'Tý',ts:'Tuyệt',chinh:['Vũ Khúc','Thiên Tướng'],hoa:{'Vũ Khúc':'Kỵ'},phu:['Lưu Niên Văn Tinh','Long Trì','Đại Hao','Quan Phù','L.Bạch Hổ']},
   'Sửu': {cung:'Phụ Mẫu',dh:113,th:'Sửu',ts:'Thai',chinh:['Thiên Đồng','Cự Môn'],phu:['Thiếu Âm','Phục Binh','Phá Toái']},
   'Tý':  {cung:'Mệnh',menh:1,dh:3,th:'Dần',ts:'Dưỡng',chinh:['Tham Lang'],phu:['Giải Thần','Phượng Các','Kình Dương','Thiên Hình','Quan Phù','Tang Môn','Đẩu Quân','L.Thiên Khốc','L.Thiên Hư']},
   'Hợi': {cung:'Huynh Đệ',dh:13,th:'Mão',ts:'Trường Sinh',chinh:['Thái Âm'],phu:['Lộc Tồn','Thiên Hỷ','Thiên Giải','Thai Phụ','Bác Sĩ','Thiếu Dương','Thiên Không','Cô Thần','Lưu Hà','Kiếp Sát']},
  }
},
];
