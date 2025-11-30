import React, { useState } from "react";

interface GetButtonProps {
  title: string;
  apiFn: () => Promise<any>;
}

const GetButton: React.FC<GetButtonProps> = ({ title, apiFn }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [resultData, setResultData] = useState("");

  const handleButtonClick = () => {
    apiFn()
      .then((result) => {
        console.log(`${title}:`, result);
        setResultData(JSON.stringify(result, null, 2)); // Pretty print the JSON
        setModalVisible(true);
      })
      .catch((error) => {
        console.error(`${title} error:`, error);
        setResultData(`error: ${error}`); // Pretty print the JSON
        setModalVisible(true);
      });
  };

  const handleClose = () => setModalVisible(false);

  return (
    <div className="text-center text-white">
      <button
        className="my-2 px-4 py-2 w-full bg-primary hover:bg-primarydark text-white rounded"
        onClick={handleButtonClick}
      >
        {title}
      </button>

      {modalVisible && (
        <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-black rounded-lg w-11/12 max-w-2xl p-6">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold">{title} Result</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleClose}
              >
                &times;
              </button>
            </div>
            <div className="text-left text-white max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap break-words">
                {resultData}
              </pre>
            </div>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetButton;