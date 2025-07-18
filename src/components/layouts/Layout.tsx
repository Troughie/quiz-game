import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import LoadingComponent from "./Loading";
import { usePlayerStore } from "@/store/Player";
import { useEffect } from "react";
import { randomName } from "@/utils";
import { v4 as uuidv4 } from "uuid";

const Layout = () => {
    const { player, createPlayer } = usePlayerStore();

    useEffect(() => {
        if (!player?.id) {
            const newPlayer = {
                id: uuidv4(),
                username: randomName(),
                avatar: "",
                _id: "",
            };
            createPlayer(newPlayer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player]);

    return (
        <>
            <LoadingComponent />
            <div className="min-h-screen flex flex-col bg-emerald-50">
                <Navbar />

                {/* Main Content */}
                <main className="flex-1 container mx-auto px-8">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="bg-white border-t mt-auto">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600">
                                © 2024 Quiz Game. All rights reserved.
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-green167"
                                >
                                    Terms
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-green167"
                                >
                                    Privacy
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-green167"
                                >
                                    Contact
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Layout;
