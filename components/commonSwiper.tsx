"use client";

import { useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow, EffectCards } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";

import "swiper/css";
import "swiper/css/navigation";

type CarouselOptions = SwiperOptions & {
  navigation?: boolean | object;
  autoplay?: boolean | object;
};

interface CommonSwiperProps {
  children: React.ReactNode;
  carouselOptions?: CarouselOptions | false;
  className?: string;
}

export { SwiperSlide };

export default function CommonSwiper({
  children,
  carouselOptions,
  className = "",
}: CommonSwiperProps) {
  const id = useId();

  if (carouselOptions === false) {
    return <>{children}</>;
  }

  const safeId = id.replace(/:/g, "");

  const options: SwiperOptions = {
    slidesPerView: 1,
    centeredSlides: false,
    spaceBetween: 0,
    loop: false,
    rewind: false,
    pagination: false,
    navigation: carouselOptions?.navigation
      ? {
          nextEl: `.swiper-instance-${safeId} .swiper-button-next`,
          prevEl: `.swiper-instance-${safeId} .swiper-button-prev`,
        }
      : false,
    onSwiper: (swiper: any) => {
      if (carouselOptions?.autoplay && swiper.autoplay) {
        setTimeout(() => {
          swiper.autoplay?.start();
        }, 100);
      }
    },
    onInit: (swiper:any) => {
      if (carouselOptions?.autoplay && swiper.autoplay) {
        swiper.autoplay?.start();
      }
    },
    modules: [Navigation, Pagination, Autoplay, EffectCoverflow, EffectCards],
    ...carouselOptions,
  };

  return (
    <Swiper
      className={`cs-swiper swiper-instance-${safeId} ${className}`}
      {...options}
    >
      {children}
    </Swiper>
  );
}
