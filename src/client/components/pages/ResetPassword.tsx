import React from 'react';
import { useParams } from 'react-router-dom';

interface ResetPasswordProps {
  
}

type ResetPasswordParams = {
  token: string,
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({}) => {
  let { token } = useParams<ResetPasswordParams>();
  return (
    <>
      <div>{ token }</div>
    </>
  );
}