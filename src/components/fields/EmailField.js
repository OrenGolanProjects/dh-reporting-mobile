import React from 'react';
import InputField from '../InputField';


const EmailField = (props) => (
  <InputField
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
    autoComplete="email"
    textContentType="emailAddress"
    inputMode="email"
    {...props}
  />
);

export default EmailField;
