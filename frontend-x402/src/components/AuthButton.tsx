import React, { useState } from "react";
import GetButton from "./GetButton";

interface AuthButtonProps {
  authenticateWithUserId: (
    userId: string,
    jwtToken: string,
    callback: (result: any, error: any) => void
  ) => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ authenticateWithUserId }) => {
  const [userId, setUserId] = useState("");
  const [jwtToken, setJwtToken] = useState("");

  const authenticate = () => {
    return new Promise((resolve, reject) => {
      authenticateWithUserId(userId, jwtToken, (result, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };

  return (
    <div className="text-center text-white bg-black p-2 rounded-lg">
      <div className="mb-2">
        <input
          type="text"
          className="px-4 py-2 mb-2 w-full bg-gray-700 text-white rounded"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          className="px-4 py-2 mb-2 w-full bg-gray-700 text-white rounded"
          placeholder="JWT Token"
          value={jwtToken}
          onChange={(e) => setJwtToken(e.target.value)}
        />
      </div>
      <GetButton title="Authenticate JWT" apiFn={authenticate} />
    </div>
  );
};

export default AuthButton;