select * from job;
select * from recruiter;
select * from company;
select * from category;

INSERT INTO job (recruiter_id, company_id, title, description, min_salary, max_salary, status, required_cv, deadline, experience, category_id, requirement, benefit, limited)
VALUES
(9, 10, 'Nhân Viên Kinh Doanh Dược Phẩm',
'- Giới thiệu và tư vấn các sản phẩm thực phẩm bảo vệ sức khỏe đến nhà thuốc, đại lý.
- Chăm sóc khách hàng cũ và tìm kiếm khách hàng mới.
- Báo cáo doanh số định kỳ cho quản lý.',
8000000, 12000000, 'open', true, '2025-09-10', 'junior', 10,
'- Tốt nghiệp trung cấp/cao đẳng dược hoặc kinh tế.
- Ưu tiên ứng viên có kinh nghiệm bán hàng dược phẩm, thực phẩm chức năng.
- Kỹ năng giao tiếp, thuyết phục tốt.',
'- Lương cứng + hoa hồng theo doanh số.
- Thưởng nóng khi đạt chỉ tiêu.
- Chế độ BHXH, BHYT, nghỉ lễ theo luật định.
- Cơ hội thăng tiến lên Trình Dược Viên chính thức.', 5),

-- Job 2: Deadline < 30 ngày
(9, 10, 'Chuyên Viên Phát Triển Thị Trường Thực Phẩm Chức Năng',
'- Nghiên cứu thị trường, phân tích nhu cầu khách hàng.
- Mở rộng kênh phân phối sản phẩm tại khu vực được giao.
- Tổ chức hội thảo, workshop để giới thiệu sản phẩm mới.',
15000000, 25000000, 'open', true, '2025-09-30', 'mid', 10,
'- Tốt nghiệp đại học chuyên ngành Marketing, Quản trị Kinh doanh hoặc Y Dược.
- Có ít nhất 2 năm kinh nghiệm phát triển thị trường.
- Thành thạo tin học văn phòng, có khả năng làm báo cáo phân tích.',
'- Thu nhập hấp dẫn: Lương cơ bản + thưởng doanh số.
- Phụ cấp đi lại, công tác phí.
- Cơ hội được đào tạo, tham gia hội nghị quốc tế về ngành dược phẩm.', 3),

-- Job 3: Deadline > 30 ngày
(9, 10, 'Trình Dược Viên Khu Vực',
'- Quản lý và phát triển hệ thống khách hàng nhà thuốc tại khu vực phụ trách.
- Đạt chỉ tiêu doanh số theo tháng/quý.
- Báo cáo định kỳ tình hình kinh doanh cho cấp quản lý.',
12000000, 20000000, 'open', true, '2025-11-15', 'mid', 10,
'- Có kinh nghiệm ít nhất 1 năm trong vai trò Trình Dược Viên.
- Có phương tiện đi lại, khả năng đi công tác tỉnh.
- Kỹ năng giao tiếp tốt, nhiệt tình, trách nhiệm.', 
'- Lương cứng + % hoa hồng theo doanh số.
- Thưởng tháng, thưởng quý theo hiệu suất.
- Được cấp phát đồng phục, hỗ trợ điện thoại, xăng xe.', 4),

-- Job 4: Deadline > 60 ngày
(9, 10, 'Quản Lý Kinh Doanh Dược Phẩm Toàn Quốc',
'- Xây dựng và quản lý đội ngũ kinh doanh trên toàn quốc.
- Lập kế hoạch kinh doanh, chiến lược phát triển thị trường.
- Theo dõi, giám sát và đào tạo nhân viên kinh doanh.
- Báo cáo trực tiếp cho ban giám đốc.',
30000000, 50000000, 'open', true, '2025-12-31', 'senior', 10,
'- Tốt nghiệp đại học trở lên chuyên ngành Kinh tế, Quản trị Kinh doanh, Y Dược.
- Có ít nhất 5 năm kinh nghiệm trong lĩnh vực kinh doanh dược phẩm, trong đó 2 năm ở vị trí quản lý.
- Kỹ năng lãnh đạo, quản lý đội nhóm xuất sắc.', 
'- Thu nhập cao: Lương cơ bản + thưởng theo lợi nhuận công ty.
- Xe công tác, phụ cấp điện thoại, công tác phí.
- Tham gia đầy đủ chế độ bảo hiểm và quyền lợi cho quản lý cấp cao.', 2);
