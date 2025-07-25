'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphonesSimple } from '@fortawesome/free-solid-svg-icons';
import Button from '@/app/components/button';
import Link from 'next/link';

export default function Footer() {
    return (
        <>
            <footer>
                <div className="px-[120px] bg-white text-center w-full border-t border-[#E7E7E8]">
                    <div className="w-full m-auto flex justify-between gap-x-24 py-8">
                        <div className="w-[49%] flex flex-col items-center gap-6">
                            <div className="text-[18px] font-bold text-[var(--primary-color)]">
                                Hotline cho Người tìm việc
                            </div>
                            <div className="flex gap-15">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 justify-center">
                                        <FontAwesomeIcon
                                            icon={faHeadphonesSimple}
                                            className="text-[14px] text-[var(--primary-color)]/80 "
                                        />
                                        <span className="text-[12px] text-[var(--primary-color)] font-[500]">
                                            Hotline hỗ trợ miền Nam
                                        </span>
                                    </div>
                                    <span className="text-[18px] text-[var(--primary-color)] font-bold">
                                        HCM: (033) 3333 4444
                                    </span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 justify-center">
                                        <FontAwesomeIcon
                                            icon={faHeadphonesSimple}
                                            className="text-[14px] text-[var(--primary-color)]/80 "
                                        />
                                        <span className="text-[12px] text-[var(--primary-color)] font-[500]">
                                            Hotline hỗ trợ miền Bắc
                                        </span>
                                    </div>
                                    <span className="text-[18px] text-[var(--primary-color)] font-bold">
                                        HN: (033) 3333 4444
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="footer"
                                className="border-[var(--primary-color)] text-[var(--primary-color)]"
                            >
                                Tư vấn cho Người tìm việc
                            </Button>
                        </div>

                        <div className="w-[1px] h-[150px]" style={{ backgroundColor: 'rgb(223, 223, 224)' }}></div>

                        <div className="w-[49%] flex flex-col items-center gap-6">
                            <div className="text-[18px] font-bold text-[var(--recuitment-color)]">
                                Hotline cho Nhà tuyển dụng
                            </div>
                            <div className="flex gap-15">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 justify-center">
                                        <FontAwesomeIcon
                                            icon={faHeadphonesSimple}
                                            className="text-[14px] text-[var(--recuitment-color)]/80 "
                                        />
                                        <span className="text-[12px] text-[var(--recuitment-color)] font-[500]">
                                            Hotline hỗ trợ miền Nam
                                        </span>
                                    </div>
                                    <span className="text-[18px] text-[var(--recuitment-color)] font-bold">
                                        HCM: (033) 3333 4444
                                    </span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 justify-center">
                                        <FontAwesomeIcon
                                            icon={faHeadphonesSimple}
                                            className="text-[14px] text-[var(--recuitment-color)]/80 "
                                        />
                                        <span className="text-[12px] text-[var(--recuitment-color)] font-[500]">
                                            Hotline hỗ trợ miền Bắc
                                        </span>
                                    </div>
                                    <span className="text-[18px] text-[var(--recuitment-color)] font-bold">
                                        HN: (033) 3333 4444
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="footer"
                                className="border-[var(--recuitment-color)] text-[var(--recuitment-color)]"
                            >
                                Tư vấn cho Nhà tuyển dụng
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="px-[120px] bg-[#181821] w-full border-t border-[#E7E7E8] py-6">
                    <div className="w-full flex flex-col ">
                        <div className="w-full grid lg:grid-cols-2 lg:gap-x-24 py-8">
                            <div className="flex flex-col gap-[15px]">
                                <Link
                                    href="/"
                                    className="text-[3rem] text-white cursor-pointer font-semiboldselect-none"
                                >
                                    <p style={{ fontFamily: 'iconFont, sans-serif' }}>BotCV</p>
                                </Link>
                                <div className="text-[12px] text-white">
                                    <span className="font-semibold">Địa chỉ:</span> Phòng xy, Tòa nhà Ax-Bx, Phường
                                    Trung Hòa, Quận Cầu Giấy, Hà Nội
                                    <br />
                                    <span className="font-semibold">Chi nhánh:</span> Tầng x, Tòa nhà xx-xxB Trần Cao
                                    Vân, Phường Đa Kao, Quận 1, Thành phố Hồ Chí Minh
                                    <br />
                                    <span className="font-semibold">Điện thoại:</span> (0xx) 7xxx xxxx | (0xx) 7xxx 2xxx
                                    <br /> <span className="font-semibold">Email hỗ trợ người tìm việc:</span>{' '}
                                    ntv@botcv.vn
                                    <br /> <span className="font-semibold">Email hỗ trợ nhà tuyển dụng:</span>{' '}
                                    ntd@botcv.vn
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex flex-col gap-[15px] w-6/12">
                                    <span className="text-[18px] font-semibold text-white mb-[12px]">Thông tin</span>
                                    <div className="text-[12px] text-white ">
                                        Cẩm nang nghề nghiệp
                                        <br />
                                        Báo giá dịch vụ
                                        <br />
                                        Điều khoản sử dụng
                                        <br />
                                        Quy định bảo mật
                                        <br />
                                        Sơ đồ trang web
                                        <br />
                                        Chính sách hỗ trợ
                                        <br />
                                        Tuân thủ của khách hàng
                                    </div>
                                </div>

                                <div className="flex flex-col gap-[15px] w-6/12">
                                    <span className="text-[18px] font-semibold text-white ">
                                        BotCV.com - Công Ty Cổ Phần Việc Làm BotCV
                                    </span>
                                    <div className="text-[12px] text-white ">
                                        <span className="font-semibold">Giấy phép hoạt động dịch vụ việc làm số:</span>{' '}
                                        111111/20xx/11/SLĐTBXH-VLATLĐ do Sở Lao Động Thương Binh và Xã Hội cấp ngày
                                        xx/xx/202x
                                        <br />
                                        <span className="font-semibold">Lĩnh vực hoạt động:</span> Cung ứng và giới
                                        thiệu việc làm; Dịch vụ việc làm trực tuyến.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[1px] border border-[#E7E7E8] mb-4"></div>

                    <span className="font-semibold text-[12px] text-white">
                        2025 - BotCV Vietnam JSC. All rights reserved.
                    </span>
                </div>
            </footer>
        </>
    );
}
