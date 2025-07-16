import { NAME_DEFAULT } from "@/constant";
import type { ItemsTypeProps } from "@/types/Index";
import { useEffect, useState } from "react";

const splitPin = (pin: string | number) => {
    const pinString = pin.toString();
    if (pinString.split("").length >= 3) {
        const pinArray = pinString.split("");
        const pinArray2 = pinArray.slice(0, 3);
        const pinArray3 = pinArray.slice(3, 6);
        return pinArray2.join("") + " " + pinArray3.join("");
    } else {
        return pinString;
    }
};

const randomName = () => {
    const randomIndex = Math.floor(0 + Math.random() * NAME_DEFAULT.length - 1);
    return NAME_DEFAULT[randomIndex];
};

const to = <T, E = Error>(
    promise: Promise<T>
): Promise<[E, null] | [null, T]> =>
    promise
        .then((data) => [null, data] as [null, T])
        .catch((err) => [err as E, null] as [E, null]);

const useAnimatedDots = () => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        let count = 0;
        const maxDots = 3;

        const intervalId = setInterval(() => {
            count = (count + 1) % (maxDots * 2); // Cycle through 0-5

            if (count <= maxDots) {
                // Adding dots phase (1-3 dots)
                setDots(".".repeat(count));
            } else {
                // Removing dots phase (2-0 dots)
                setDots(".".repeat(maxDots * 2 - count));
            }
        }, 300);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return dots;
};
const formattedDate = (date: number) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

export const ItemsType: ItemsTypeProps[] = [
    {
        link: "/",
        img: "/images/icons/navigation/start.svg",
        title: "Start",
        description: "Start",
    },
    {
        link: "/",
        img: "/images/icons/navigation/start.svg",
        title: "Art &amp; Literature",
        description: "Art &amp; Literature",
    },
    {
        link: "/",
        img: "/images/icons/navigation/start.svg",
        title: "Entertainment",
        description: "Entertainment",
    },
    {
        link: "/",
        img: "/images/icons/navigation/start.svg",
        title: "Geography",
        description: "Geography",
    },
    {
        link: "/",
        img: "/images/icons/navigation/start.svg",
        title: "History",
        description: "History",
    },
    {
        link: "/",
        img: "/images/icons/navigation/start.svg",
        title: "Languages",
        description: "Languages",
    },
    {
        link: "/",
        img: "/images/icons/navigation/start.svg",
        title: "Science &amp; Nature",
        description: "Science &amp; Nature",
    },
    {
        link: "/",
        img: "/images/icons/navigation/start.svg",
        title: "Sports",
        description: "Sports",
    },
    {
        link: "/",
        img: "/images/icons/navigation/start.svg",
        title: "Trivia",
        description: "Trivia",
    },
];

export { splitPin, randomName, to, useAnimatedDots, formattedDate };
