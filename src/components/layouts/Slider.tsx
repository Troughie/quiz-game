import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface SliderProps<T extends Record<string, any>> {
    data: T[];
    Component: React.ComponentType<T>;
    title: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Slider = <T extends Record<string, any>>({
    data,
    Component,
    title,
}: SliderProps<T>) => {
    console.log(data);

    return (
        <>
            {data.length >= 1 && (
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
            )}

            <Swiper
                slidesPerView={1}
                spaceBetween={10}
                pagination={{
                    clickable: true,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 4,
                    },
                    1024: {
                        slidesPerView: 5,
                    },
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={index} className="!w-auto">
                        <Component {...item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default Slider;
