'use client'
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the modal to prevent SSR issues
const WebcamCaptureModal = dynamic(
    () => import("../../../components/WebcamCapture"),
    { ssr: false }
);

const WebcamModalPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Webcam Capture Modal Example</h1>
            <button onClick={openModal}>Open Webcam Modal</button>
            <WebcamCaptureModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default WebcamModalPage;
