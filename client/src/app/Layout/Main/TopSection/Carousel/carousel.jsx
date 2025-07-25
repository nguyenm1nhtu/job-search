'use client';

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import './carousel.css';

const NextArrow = ({ className, onClick }) => (
    <div className={`${className} arrow slick-next`} onClick={onClick}>
        <FontAwesomeIcon
            icon={faAngleRight}
            style={{ color: 'var(--primary-color)', fontSize: '18px', marginLeft: '5px' }}
        />
    </div>
);

const PrevArrow = ({ className, onClick }) => (
    <div className={`${className} arrow slick-prev`} onClick={onClick}>
        <FontAwesomeIcon
            icon={faAngleLeft}
            style={{ color: 'var(--primary-color)', fontSize: '18px', marginRight: '5px' }}
        />
    </div>
);

export default function Carousel({ images = [] }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        swipe: true,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        appendDots: (dots) => (
            <div style={{ bottom: '8px' }}>
                <ul className="slick-dots">{dots}</ul>
            </div>
        ),
        customPaging: () => <button className="slick-dot"></button>,
    };

    return (
        <div className="carouselContainer">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className="slide">
                        <Image
                            src={image}
                            alt={`Slide ${index + 1}`}
                            fill
                            className="object-cover"
                            quality={100}
                            priority={index === 0}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}
