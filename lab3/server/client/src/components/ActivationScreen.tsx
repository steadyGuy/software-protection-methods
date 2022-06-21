import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import axios from '../services/axios'
import { updateLicense } from '../utils/generateLicense'
import vigenereCipher from '../utils/vigenereCipher'
import CustomSnackbar from './CustomSnackbar'

const ActivationScreen = () => {
  const [activationCode, setActivationCode] = useState("");
  const [error, setError] = useState("");

  const handleActivation = async () => {
    try {
      const token = (document.querySelector("#g-recaptcha-response") as any)?.value || '';
      console.log('token', token)
      const { data } = await axios.post(
        "/validateForm/google",
        { captcha: token }
      );

      if (!data.isSuccess) {
        return setError("Please, pass a captcha");
      }

      const licenseInfo = JSON.parse(localStorage.getItem('license') as string);
      const decryptedByUser =
        vigenereCipher().decrypt(licenseInfo.codedPhrase, vigenereCipher().generateKey(activationCode, licenseInfo.codedPhrase))
      const decrypotedOriginal =
        vigenereCipher().decrypt(licenseInfo.codedPhrase, vigenereCipher().generateKey(`${process.env.REACT_APP_SECRET_KEY}`, licenseInfo.codedPhrase))

      if (decrypotedOriginal === decryptedByUser) {
        updateLicense("isConfirmed", true)
        document.location.reload();
      } else {
        setError("The key is incorrect");
      }
    } catch (error) {
      setError("Please, pass or repass a captcha");
      console.log("Error: ", error);
    }
  }

  return (
    <Box sx={{ mt: 58 }}>
      <CustomSnackbar message={error} setMessage={setError} />
      <TextField
        placeholder="Type key here..."
        onChange={(e) => setActivationCode(e.target.value)}
        value={activationCode}
        variant="standard"
        sx={{ width: '100%', mb: 2 }}
      />
      <Button variant="contained" sx={{ backgroundColor: 'black', width: '100%' }} onClick={handleActivation}>
        Activate
      </Button>
      <Box className="g-recaptcha" data-sitekey={`${process.env.REACT_APP_GOOGLE_RECAPTCHA_PUBLIC_KEY}`} sx={{ mt: 4 }} />
    </Box>
  )
}

export default ActivationScreen