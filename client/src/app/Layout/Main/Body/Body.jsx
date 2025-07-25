'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMoneyBillWave,
    faLocationDot,
    faClock,
    faAngleRight,
    faAngleLeft,
    faFire,
} from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';

export default function Body({ title, jobs, className }) {
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 9;

    const offset = currentPage * cardsPerPage;
    const currentCards = jobs.slice(offset, offset + cardsPerPage);
    const pageCount = Math.ceil(jobs.length / cardsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    return (
        <>
            <div className={`w-full py-[24px] flex flex-col gap-10 px-[120px] py-[24px] ${className}`}>
                <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faFire} className="text-[30px] h-25 text-[#F7393C]" />
                    <h1 className="text-[24px] font-semibold bg-gradient-to-r from-[#F7393C] to-[#FF9152] bg-clip-text text-transparent line-clamp-1">
                        {title}
                    </h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {currentCards.map((job, index) => (
                        <div
                            key={index}
                            className="cursor-pointer flex flex-col rounded-[8px] bg-white border border-[#E7E7E8] hover:border-[var(--primary-color)]"
                        >
                            <div className="flex flex-col p-4 gap-2">
                                <h2 className="text-[14px] font-medium">{job.position}</h2>
                                <div className="flex gap-4">
                                    <div className="w-[58px] min-w-[58px] h-[58px] min-h-[58px] rounded-[8px] overflow-hidden">
                                        <img
                                            src={job.logo}
                                            alt={` ${job.company}  logo`}
                                            className="object-contain my-auto w-full h-full  "
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-[12px] text-[var(--text-color)] line-clamp-1 font-[500]">
                                            {job.company}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <FontAwesomeIcon
                                                icon={faMoneyBillWave}
                                                className=" text-[#939295] w-[16px] h-[22px]"
                                            />
                                            <span className="text-[12px] text-[var(--primary-color)] font-[500]">
                                                {job.salary}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FontAwesomeIcon
                                                icon={faLocationDot}
                                                className="text-[#939295] w-[16px] h-[22px]"
                                            />
                                            <span className="text-[12px] font-[500]">{job.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-[1px] bg-[#E7E7E8] my-1"></div>

                                <div className="flex items-center justify-between">
                                    {!job.requiredCV && (
                                        <div className="bg-[#e5f2ff] py-1 px-2 text-center text-[10px] text-[#2469ae] rounded-[5px] font-semibold">
                                            <span>Không cần CV</span>
                                        </div>
                                    )}
                                    {job.requiredCV && <div className="w-[100px] h-0"></div>}
                                    <div className="flex gap-2 items-center py-1">
                                        <FontAwesomeIcon icon={faClock} className="text-[#939295] w-[12px] h-[20px]" />
                                        <span className="text-[10px] font-[500]">{`Còn ${job.time} ngày`}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {currentCards.length % 3 !== 0 &&
                        Array.from({ length: 3 - (currentCards.length % 3) }).map((_, index) => (
                            <div key={`dummy-${index}`} className="hidden md:block"></div>
                        ))}
                </div>

                <div className="mt-5 flex justify-center items-center select-none">
                    <ReactPaginate
                        previousLabel={<FontAwesomeIcon icon={faAngleLeft} />}
                        nextLabel={<FontAwesomeIcon icon={faAngleRight} />}
                        breakLabel="..."
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={2}
                        onPageChange={handlePageClick}
                        containerClassName="flex items-center justify-center gap-3"
                        activeClassName="border border-[var(--primary-color)] text-[var(--primary-color)]"
                        pageClassName="w-10 h-10 rounded-full border hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] cursor-pointer"
                        pageLinkClassName="flex items-center justify-center w-full h-full"
                        previousClassName="flex items-center justify-center w-10 h-10 rounded-full border cursor-pointer hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] mx-2"
                        previousLinkClassName="flex items-center justify-center w-full h-full"
                        nextClassName="flex items-center justify-center w-10 h-10 rounded-full border cursor-pointer hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] mx-2"
                        nextLinkClassName="flex items-center justify-center w-full h-full"
                        breakClassName="flex items-center justify-center w-10 h-10"
                        breakLinkClassName="text-gray-500"
                        disabledClassName="opacity-50"
                        renderOnZeroPageCount={null}
                    />
                </div>
            </div>
        </>
    );
}
