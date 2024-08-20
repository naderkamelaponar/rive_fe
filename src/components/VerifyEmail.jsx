// src/components/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyEmail } from  '../../api'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(email);
        setMessage(response.message);
      } catch (error) {
        setMessage('Error verifying email.');
        console.error('Error verifying email:', error);
      }
    };

    if (email) {
      verify();
    } else {
      setMessage('Invalid verification link.');
    }
  }, [email]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
